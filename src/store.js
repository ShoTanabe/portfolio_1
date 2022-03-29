import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState({
		key: 'vuexapp',
		paths: [
			'currentUser',
			'currentProject'
		],
		storage: window.sessionStorage
	})],

	state: {
		projectList: [],
		taskList: [],
		currentUser: {
			id: '',
			name: '',
			address: '',
			password: '',
			iconPath: ''
			},
		currentProject: {
			projectName: '',
			startDate: '',
			finishDate: '',
			projectMembers: [],
			id: '',
			showDeletingProjectModal: false,
			showEditingProjectModal: false,
			},
		currentTask: {
			taskName: '',
			taskOutline: '',
			finishDate: '',
			finishTime: '',
			taskLeader: '',
			id: '',
			showTaskDetailModal: false,
}
	},
	getters: {
		projectList: state => state.projectList,
		taskList: state => state.taskList,
		currentUser: state => state.currentUser,
		currentProject: state => state.currentProject,
		currentTask: state => state.currentTask,
	},
	mutations: {
		updateProjectList(state, projectList) {
			state.projectList = projectList
		},
		updateTaskList(state, taskList) {
			state.taskList = taskList
		},
		updateCurrentUser(state, currentUser) {
			state.currentUser = currentUser
		},
		updateCurrentProject(state, currentProject) {
			state.currentProject = currentProject
		},
		updateCurrentTask(state, currentTask) {
			state.currentTask = currentTask
		},
	}
});