<template>
	<div class='route_container'>
      <TopPosts/>
      <Timer/>
	</div>
	
</template>

<script>
	import TabView from '../TabView'
	import ScrollLoad from '../ScrollLoad'
	import ThreadDisplay from '../ThreadDisplay'
	import ThreadDisplayPlaceholder from '../ThreadDisplayPlaceholder'
	import SelectOptions from '../SelectOptions'
	import SelectButton from '../SelectButton'

	import AjaxErrorHandler from '../../assets/js/errorHandler'
	import logger from '../../assets/js/logger'
  import Thread from './Thread'
	import TopPosts from '../widgets/TopPosts'
	import Timer from '../widgets/Timer'

	export default {
		name: 'index',
		components: {
			TabView,
			ScrollLoad,
			ThreadDisplay,
			ThreadDisplayPlaceholder,
			SelectOptions,
      SelectButton,
      Thread,
			TopPosts,
			Timer
		},
		data () {
			return {
				filterOptions: [
					{name: 'New', value: 'NEW'},
					{name: 'Most active', value: 'MOST_ACTIVE'},
					{name: 'No replies', value: 'NO_REPLIES'}
				],
				selectedFilterOption: 'NEW',

				nextURL: '',
				nextThreadsCount: 0,
				loading: false,

				threads: null,
				newThreads: 0,
				loadingNewer: false
			}
		},
		computed: {
			filteredThreads () {
				var categories = {};
				var filter = this.selectedFilterOption

				this.$store.state.meta.categories.forEach(category => {
					categories[category.value] = category.name;
				});

				return this.threads.filter(thread => {
					return (thread.Category.value === this.selectedCategory) || (this.selectedCategory === 'ALL');
				}).map(thread => {
					var _thread = Object.assign({}, thread);
					_thread.category = categories[thread.Category.value];

					return _thread;
				}).sort((a, b) => {
					if(filter === 'NEW') {
						let aDate = new Date(a.Posts[0].createdAt)
						let bDate = new Date(b.Posts[0].createdAt)

						return bDate - aDate;
					} else if(filter === 'MOST_ACTIVE') {
						return b.postsCount - a.postsCount;
					}
				}).filter(thread => {
					if(filter === 'NO_REPLIES' && thread.postsCount-1) {
						return false
					} else {
						return true;
					}
				});
			},
			categories () {
				return this.$store.getters.alphabetizedCategories
			},
			selectedCategory: {
				set (val) {
					let name = this.categories.find(c => c.value === val)

					this.$store.dispatch('setTitle', name ? name.name : '')
					this.$store.commit('setSelectedCategory', val)
				},
				get () {
					return this.$store.state.category.selectedCategory
				}
			},
			postNewThreadText () {
				if(this.$store.state.username) {
					return 'Post new thread'
				} else {
					return 'Login to post'
				}
			}
		},
		methods: {
			navigateToThread (slug, id) {
				this.$router.push('/thread/' + slug + '/' + id);
			},
			getThreads (initial) {
				if(this.nextURL === null && !initial) return

				let URL = '/api/v1/category/' + this.selectedCategory
				if(!initial) {
					URL = this.nextURL || URL
				}

				this.loading = true

				this.axios
					.get(URL)
					.then(res => {
						this.loading = false

						if(initial) {
							this.threads = res.data.Threads
						} else {
							this.threads.push(...res.data.Threads)
						}

						this.nextURL = res.data.meta.nextURL
						this.nextThreadsCount = res.data.meta.nextThreadsCount
					})
					.catch((e) => {
						this.loading = false

						AjaxErrorHandler(this.$store)(e)
					})
			},
			getNewerThreads () {
				this.loadingNewer = true

				this.axios
					.get('/api/v1/category/' + this.selectedCategory + '?limit=' + this.newThreads)
					.then(res => {
						this.loadingNewer = false
						this.newThreads = 0

						this.threads.unshift(...res.data.Threads)
					})
					.catch((e) => {
						this.loadingNewer = false
						AjaxErrorHandler(this.$store)(e)
					})
			}
		},
		watch: {
			selectedCategory (newValue) {
				this.$router.push('/category/' + newValue.toLowerCase());
			},
			$route () {
				this.selectedCategory = this.$route.path.split('/')[2].toUpperCase()
				this.newThreads = 0
				this.getThreads(true)
			}
		},
		created () {
			this.selectedCategory = this.$route.path.split('/')[2].toUpperCase()
			this.getThreads(true)

			socket.emit('join', 'index')
			socket.on('new thread', data => {
				if(data.value === this.selectedCategory || this.selectedCategory == 'ALL') {
					this.newThreads++
				}
			})

			if(this.$route.query.token) {
				this.$store.commit('setToken', this.$route.query.token)
				this.$store.commit('setAccountTabs', 0)
				this.$store.commit('setAccountModalState', true)
			}

			logger('index')
		},
		destroyed () {
			socket.emit('leave', 'index')
			socket.off('new thread')
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../assets/scss/elementStyles.scss';
	@import '../../assets/scss/variables.scss';
  .flex-container {
    display: flex;
  }
  video-wrapper{
    position: relative;
    padding-bottom: 56.25%;  //16:9
    overflow: hidden;
  }
  video-wrapper iframe{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
	.forum_description {
		padding: 1rem;
		margin-bottom: 2rem;
		background-color: #fff;
		border-radius: 0.25rem;
		border: thin solid $color__gray--darker;
	}

	.threads_main {
		display: flex;
	}

	.thread_sorting {
		margin-bottom: 1rem;
		display: flex;
		justify-content: space-between;

		@at-root #{&}__display {
			padding-right: 0.5rem;
			border-right: thin solid $color__gray--primary;
			margin-right: 1.25rem;
			width: 10rem;
		}

		@at-root #{&}__add_and_categories {
			.select_button {
				display: none;
			}
		}
	}

	.threads_main__side_bar {
		width: 12rem;
		height: 0%;
		background: #fff;
		margin-right: 1rem;
		border-radius: 0.25rem;
		border: thin solid $color__gray--darker;
		padding: 0.5rem 0 1rem 1rem;
		position: sticky;
		top: 4.5rem;

		@at-root #{&}__title {
			color: $color__darkgray--darker;
			cursor: default;
			font-weight: 500;
			font-size: 1.125rem;
		}

		@at-root #{&}__menu_item {
			cursor: pointer;
			margin-top: 0.5rem;
			position: relative;
			display: grid;
			grid-template-columns: 0.75rem auto;
			grid-column-gap: 1rem;
			text-decoration: none;
			background-image: none;
			font-weight: normal;

			@at-root #{&}__border {
				align-self: center;
				display: inline-block;
				height: 0.9rem;
				width: 0.9rem;
				border-radius: 0.25rem;
				margin-top: 0.25rem;
				background-color: $color__gray--darkest;
				transition: all 0.2s;
			}

			@at-root #{&}__text {
				filter: saturate(0.75), brightness(0.75);
			}
			

			@at-root #{&}--selected {
				font-weight: 600;
			}
		}
	}
	.threads_main__threads {
		margin-left: 1rem;
		width: calc(100% - 11rem);
	}

	.threads_main__load_new {
		@extend .button;

		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		background-color: $color__lightgray--primary;
		border-color: $color__gray--darker;
		width: 100%;
		font-weight: 300;
	}

	.thread {
		background-color: #fff;
		padding: 0.5rem 0;
		cursor: default;
		text-align: left;
		transition: background-color 0.2s;

		&:hover {
			background-color: $color__lightgray--primary;
		}

		td, th {
			padding: 0.3rem 0.5rem;
			border-bottom: solid thin $color__lightgray--primary;
		}

		@at-root #{&}--header {
			&:hover {
				background-color: #fff;
			}

			th {
				font-weight: 400;
				padding-bottom: 0.25rem;
				border-bottom: thin solid $color__lightgray--darkest;
			}
		}

		@at-root #{&}__section {
			padding: 0 0.5rem;
		}

		@at-root #{&}__user {
			display: inline-block;
		}
		@at-root #{&}__date {
			color: $color__text--secondary;
			display: inline-block;
		}
	}

	@media (max-width: $breakpoint--tablet) {
		.thread_sorting {
			flex-direction: column-reverse;
			align-items: left;

			@at-root #{&}__add_and_categories {
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin-bottom: 0.5rem;

				.select_button {
					display: inline-block;
				}
			}
		}

		.threads_main__side_bar {
			display: none;
		}
		.threads_main__threads {
			width: 100%;
			margin-left: 0;
		}
	}

	@media (max-width: $breakpoint--tablet) and (min-width: $breakpoint--phone) {
		.route_container {
			padding: 1rem 2rem;
		}
	}
</style>