<template>
  <div class="container">
    <HomeHeader @openEditingUserDataModal="openEditingUserDataModal()"></HomeHeader><br>
    <ProjectHeader></ProjectHeader>
    <div class="create-task-btn"
    @click="openMakingTaskModal">
      <i class="fas fa-plus"></i> タスクを追加
    </div>
    <div class="clearfix switch-search-container">
      <div class="switch-area">
        <SwitchBtn
          @changeSortType="changeSortType"></SwitchBtn>
      </div>
      <!-- <div class="search-area">
        <SearchBox></SearchBox>
      </div> -->
    </div>
    <div>
      <h2>タスク一覧</h2>
      <div v-if="showDateSortedTasks">
        <p class="sort-type">- 日付ごと -</p>
        <div
        v-for="(date, i) in dailyTasks"
        :key="date.finishDate + i"
        class="tasks-area">
          <p class="scheduled-date"><i class="fas fa-star"></i> {{ date.finishDate }}</p>
          <div
          v-for="(task, i) in date.tasks"
          :key="task.taskName + i"
          class="task-card clearfix"
          @click="chooseTask(task)">
            <div class="card-left">
              <div class="name-period">
                <p class="task-name">{{ task.taskName }}</p>
                <p class="work-period">{{ task.finishDate }} {{ task.finishTime }}</p>
              </div>
              <div class="user-icons">担当者：{{ task.taskLeader }}</div>
            </div>
          </div>
        </div>

      </div>
      <div v-if="showLeaderSortedTasks">
        <p class="sort-type">- 担当者ごと -</p>

        <div
        v-for="(leader, i) in tasksForLeader"
        :key="leader.leader + i"
        class="tasks-area">
          <p class="scheduled-date"><i class="fas fa-star"></i> {{ leader.leader }}</p>
          <div
          v-for="(task, i) in leader.tasks"
          :key="task.taskName + i"
          class="task-card clearfix"
          @click="chooseTask(task)">
            <div class="card-left">
              <div class="name-period">
                <p class="task-name">{{ task.taskName }}</p>
                <p class="work-period">{{ task.finishDate }} {{ task.finishTime }}</p>
              </div>
              <div class="user-icons">担当者：{{ task.taskLeader }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-if="showMakingTaskModal" v-cloak>
      <MakingTaskModal
        @closeMakingTaskModal="closeMakingTaskModal">
      </MakingTaskModal>
    </div>
    <div v-if="showEditingUserDataModal" v-cloak>
      <EditingUserDataModal
        @closeEditingUserDataModal="closeEditingUserDataModal">
      </EditingUserDataModal>
    </div>
    <div v-if="this.currentTask.showTaskDetailModal" v-cloak>
      <TaskDetailModal></TaskDetailModal>
    </div>
  </div>
</template>

<script>
import HomeHeader from '@/components/home_header.vue'
import ProjectHeader from '@/components/project_header.vue'
import SwitchBtn from '@/components/switch_btn.vue'
// import SearchBox from '@/components/search_box.vue'
import MakingTaskModal from '@/components/making_task_modal.vue'
import EditingUserDataModal from '@/components/editing_userdata_modal.vue'
import TaskDetailModal from '@/components/task_detail_modal.vue'

import {
  collection,
  getFirestore,
  getDocs
  } from "firebase/firestore";


export default {
  components: {
    HomeHeader,
    ProjectHeader,
    SwitchBtn,
    // SearchBox,
    MakingTaskModal,
    EditingUserDataModal,
    TaskDetailModal
  },
  data() {
    return {
      showDateSortedTasks: true,
      showLeaderSortedTasks: false,
      showMakingTaskModal: false,
      showEditingUserDataModal: false,
    }
  },
  computed: {
    currentProject() {
      return this.$store.getters.currentProject;
    },
    taskList() {
      return this.$store.getters.taskList;
    },
    projectPeriod() {
      const currentProject = this.$store.getters.currentProject;
      const startDate = new Date(currentProject.startDate);
      const finishDate = new Date(currentProject.finishDate);
      const projectPeriod = [];
      let theDay = startDate;
      while( theDay <= finishDate ) {
        projectPeriod.push((theDay.getMonth() + 1) + '月' + theDay.getDate() + '日');
        theDay = new Date(theDay.setDate(theDay.getDate() + 1))
      }
      return projectPeriod;
    },
    dailyTasks() {
      const dailyTasks = [];
      this.projectPeriod.forEach((date) => {
        const dateTaskObj = {
          finishDate: date,
          tasks: []
        }
        this.taskList.forEach((task) => {
          const finishDate = new Date(task.finishDate);
          const japaneseFinishDate = (finishDate.getMonth() + 1) + '月' + finishDate.getDate() + '日'
          if(date === japaneseFinishDate) {
            dateTaskObj.tasks.push(task)
          }
        });
        dateTaskObj.tasks.sort((m, n) => {
          return new Date(m.finishDate +' '+ m.finishTime) - new Date(n.finishDate +' '+ n.finishTime);
        });
        dailyTasks.push(dateTaskObj);
      })
      return dailyTasks
    },
    tasksForLeader() {
      const tasksForLeader = [];
      const leaders = [];
      this.currentProject.projectMembers.forEach((member) => {
        leaders.push(member.name)
      })
      leaders.forEach((leader) => {
        const leaderTaskObj = {
          leader: leader,
          tasks: []
        }
        this.taskList.forEach((task) => {
          if(leader === task.taskLeader) {
            leaderTaskObj.tasks.push(task)
          }
        });
        leaderTaskObj.tasks.sort((m, n) => {
          return new Date(m.finishDate +' '+ m.finishTime) - new Date(n.finishDate +' '+ n.finishTime);
        });
        tasksForLeader.push(leaderTaskObj)
      })
      return tasksForLeader
    },
    currentTask() {
      return this.$store.getters.currentTask;
    },
  },
  methods: {
    changeSortType(status) {
      if(status === false) {
        this.showDateSortedTasks = true;
        this.showLeaderSortedTasks = false;
      } else {
        this.showDateSortedTasks = false;
        this.showLeaderSortedTasks = true;
      }
    },
    openMakingTaskModal() {
      this.showMakingTaskModal = true;
    },
    closeMakingTaskModal() {
      this.showMakingTaskModal = false;
    },
    openEditingUserDataModal() {
      this.showEditingUserDataModal = true;
    },
    closeEditingUserDataModal() {
      this.showEditingUserDataModal = false;
    },
    chooseTask(task) {
      const currentTask = {
        taskName: task.taskName,
        taskOutline: task.taskOutline,
        finishDate: task.finishDate,
        finishTime: task.finishTime,
        taskLeader: task.taskLeader,
        id: task.id,
        showTaskDetailModal: true,
      }
      this.$store.commit('updateCurrentTask', currentTask);
    },
  },
  created() {
    getDocs(collection(getFirestore(), 'projects', this.$store.getters.currentProject.id, 'tasks'))
    .then((querySnapshot) => {
        const tasksData = []
        querySnapshot.forEach((doc) => {
          const taskData = {
            taskName: doc.data().taskName,
            taskOutline: doc.data().taskOutline,
            finishDate: doc.data().finishDate,
            finishTime: doc.data().finishTime,
            taskLeader: doc.data().taskLeader,
            id: doc.id,
            showTaskDetailModal: false,
          }
          tasksData.push(taskData)
        })
        this.$store.commit('updateTaskList', tasksData);
      }
    )
    .catch(() => {
      console.log('データ取得失敗');
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .container {
    h2 {
      margin: 60px 0 0 0;
      font-size: 1.6em;
    }

    .sort-type {
      font-size: 0.9em;
      text-align: center;
      margin: 5px 0 60px 0;
    }

    .scheduled-date {
      font-size: 1.4em;
      font-weight: bold;
      margin: 0 0 20px 15px;
      color: #333333;
    }

    .switch-search-container{
      margin-top: 60px;

      .switch-area {
        width: 35%;
        float: left;
      }

      .search-area {
        width: 65%;
        float: left;
      }
    }

    .switch-area {
      width: 50%;
      float: left;
    }

    .search-area {
      width: 50%;
      float: left;
    }

    .create-task-btn {
        width: 240px;
        margin: 30px auto 10px auto;
        border-radius: 25px;
        border: 1px solid #5c5c5c;
        background-color: #5c5c5c;
        color: #fff;
        text-align: center;
        padding: 15px;
        cursor: pointer;

        &:hover {
          border: 1px solid #5c5c5c;
          color: #5c5c5c;
          background-color: #fff;
        }
    }

    .tasks-area {
      margin-top: 50px;
    }

    .task-card {
      border: solid #305baa 2px;
      border-radius: 15px;
      cursor: pointer;
      position: relative;
      margin-top: 15px;

      .card-left {
        display: flex;
        width: 95%;
        padding: 10px 30px;

        @media screen and (max-width: 760px) {
          display: block;
          width: 100%;
          padding: 15px;
        }

        .name-period {
          width: 50%;

          @media screen and (max-width: 760px) {
            width: 90%;
            text-align: center;
          }

          .task-name {
            margin-top: 20px;
            font-size: 1.3em;
            font-weight: bold;
            color: #444444;
          }

          .work-period {
            margin: 10px 0 0 0;
            font-size: 0.9em;
          }
        }

        .user-icons {
          margin: 0 10px 0 50px ;
          padding: 30px 20px;
          width: 50%;

          @media screen and (max-width: 760px) {
            text-align: center;
            margin: 0 0 15px 0;
            padding: 0;
            width: 90%;
          }
        }
      }


      &:hover {
        border: solid 2px #fff;
        box-shadow: 0 0 5px #333333;
      }

    }


  }



</style>
