<template>
  <div class="container">
    <HomeHeader @openEditingUserDataModal="openEditingUserDataModal()"></HomeHeader>
    <div class="displayed">
      <h2>参加中のプロジェクト</h2>
      <div class="projects-area">
        <div class="project-card clearfix"
          v-for="project in projectList"
          :key="project.projectName">
          <div
            @click="chooseProject(project)"
            class="card-left">
            <div class="name-period">
              <p class="project-name">{{ project.projectName }}</p>
              <p class="work-period">{{ project.startDate }} ～ {{ project.finishDate }}</p>
            </div>
            <div class="user-icons">
              <div
                v-for="(memberData, i) in project.projectMembers"
                :key="memberData.name+i"
                class="icon-img">
                <img :src=memberData.iconPath alt="取得できません">
              </div>
            </div>
          </div>
          <div class="card-right">
            <div class="close-btn"
              @click="openDeletingProjectModal(project)">
              <i class="fas fa-times"></i>
            </div>
            <div class="opt-btn"
              @click="openEditingProjectModal(project)">
              <i class="fas fa-cog"></i>
            </div>
          </div>
          <div v-if="project.showEditingProjectModal" v-cloak>
            <EditingProjectModal
              :project="project"
              @closeEditingProjectModal="closeEditingProjectModal(project)">
            </EditingProjectModal>
          </div>
          <div v-if="project.showDeletingProjectModal" v-cloak>
            <DeletingProjectModal
              :project="project"
              @closeDeletingProjectModal="closeDeletingProjectModal(project)">
            </DeletingProjectModal>
          </div>
        </div>
      </div>
      <div class="create-project-btn"
        @click="openMakingProjectModal">
        <i class="fas fa-plus"></i> プロジェクトを追加
      </div>
    </div>
    <div v-if="showMakingProjectModal" v-cloak>
      <MakingProjectModal
        @closeMakingProjectModal="closeMakingProjectModal">
      </MakingProjectModal>
    </div>
    <div v-if="showEditingUserDataModal" v-cloak>
      <EditingUserDataModal
        @closeEditingUserDataModal="closeEditingUserDataModal">
      </EditingUserDataModal>
    </div>
  </div>
</template>

<script>
import HomeHeader from '@/components/home_header.vue'
import MakingProjectModal from '@/components/making_project_modal.vue'
import EditingProjectModal from '@/components/editing_project_modal.vue'
import DeletingProjectModal from '@/components/deleting_project_modal.vue'
import EditingUserDataModal from '@/components/editing_userdata_modal.vue'

import {
  collection,
  getFirestore,
  getDocs
  } from "firebase/firestore";


export default {
  components: {
    HomeHeader,
    MakingProjectModal,
    EditingProjectModal,
    DeletingProjectModal,
    EditingUserDataModal
  },
  data() {
    return {
      showMakingProjectModal: false,
      showEditingUserDataModal: false,
      openModalNmb: 0,
      projectsData: [],
      userList: [],
      userIcons: []
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    projectList() {
      const allProjects = this.$store.getters.projectList;
      const assignedProjects = [];
      allProjects.forEach((project) => {
        project.projectMembers.forEach((memberData) => {
          if(memberData.name === this.currentUser.name) {
            assignedProjects.push(project)
          }
        })
      })
      return assignedProjects;
    },
  },
  methods: {
    openMakingProjectModal() {
      this.showMakingProjectModal = true;
    },
    closeMakingProjectModal() {
      this.showMakingProjectModal = false;
    },
    openEditingProjectModal(project) {
      project.showEditingProjectModal = true;
    },
    closeEditingProjectModal(project) {
      project.showEditingProjectModal = false;
    },
    openDeletingProjectModal(project) {
      project.showDeletingProjectModal = true;
    },
    closeDeletingProjectModal(project) {
      project.showDeletingProjectModal = false;
    },
    openEditingUserDataModal() {
      this.showEditingUserDataModal = true;
    },
    closeEditingUserDataModal() {
      this.showEditingUserDataModal = false;
    },
    chooseProject(project) {
      this.$store.commit('updateCurrentProject', project);
      this.$router.push('/dashboard');
    }
  },
  created() {
    getDocs(collection(getFirestore(), 'projects'))
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const projectData = {
            projectName: doc.data().projectName,
            startDate: doc.data().startDate,
            finishDate: doc.data().finishDate,
            projectMembers: doc.data().projectMembers,
            id: doc.id,
            showDeletingProjectModal: false,
            showEditingProjectModal: false,
          }
          this.projectsData.push(projectData)
        })
        this.$store.commit('updateProjectList', this.projectsData);
      }
    )
    .catch(() => {
      console.log('データ取得失敗');
    })

    getDocs(collection(getFirestore(), 'users'))
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          doc.data().id = doc.id;
          this.userList.push(doc.data());
        });
      })
      .catch(() => {
        console.log('storeアクセス失敗')
      })

  },
}
</script>

<style scoped lang="scss">

[v-cloak] {
  opacity: 0;
}

.container {
    h2 {
      margin: 60px 0;
      font-size: 1.6em;
    }

  .create-project-btn {
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

  .project-card {
    margin-bottom: 20px;
    border: solid #444444 1px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;

    .card-left {
      display: flex;
      width: 95%;
      padding: 30px;

      @media screen and (max-width: 760px) {
        display: block;
        width: 100%;
        padding: 15px;
      }

      .name-period {
        width: 40%;

        @media screen and (max-width: 760px) {
          width: 90%;
          text-align: center;
        }

        .project-name {
          margin-top: 20px;
          font-size: 1.3em;
          font-weight: bold;
          color: #444444;
        }

        .work-period {
          margin: 10px 5px;
          font-size: 0.9em;
        }
      }

      .user-icons {
        margin: 0 10px 0 50px ;
        padding: 30px 20px;
        width: 60%;
        display: flex;

        @media screen and (max-width: 760px) {
          text-align: center;
          margin: 0 0 15px 0;
          padding: 0;
          width: 90%;
        }

        .icon-img {
          margin-left: 5px;

        &:first-child {
          margin-left: 0px;
        }

        }

        img {
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
      }
    }


    &:hover {
      border: solid 1px #fff;
      box-shadow: 0 0 5px #333333;
    }

      .close-btn{
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 1.6em;
        color: #444444;

        &:hover {
          color: #bbbbbb;
        }
      }
      .opt-btn{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 1.6em;
        color: #444444;

        &:hover {
          color: #bbbbbb;
        }
      }
  }

}




</style>
