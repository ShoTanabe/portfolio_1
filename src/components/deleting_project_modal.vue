<template>
      <div class="modal">
        <div class="modal-content">
          <div class="modal-body">
            <p>{{ project.projectName }}</p>
            <p class="modal-title">プロジェクトを削除しますか？</p>
            <button class="ok-btn" @click="deleteProject(project)">プロジェクトを削除</button>
            <button class="cancel-btn" @click="closeModal(project)">キャンセル</button>
          </div>
        </div>
      </div>
</template>

<script>
import {
  doc,
  deleteDoc,
  collection,
  getFirestore,
  getDocs
 } from "firebase/firestore";

export default {
  name: 'DeletingProjectModal',
  props: {
    project: {
      type: Object,
      default:()=>{}
    }
  },
  data() {
    return {
      projectsData:[]
    }
  },
  computed: {
    projectList() {
      return this.$store.getters.projectList;
    }
  },
  methods: {
    deleteProject(project) {

      deleteDoc(doc(getFirestore(), 'projects', project.id))
      .then(() => {
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
      })
      .catch(() => {
        console.log('データ削除失敗')
      })
      this.$store.commit('updateProjectList', this.projectList);
    },
    closeModal(project) {
      this.$emit('closeDeletingProjectModal',project);
    }
  },
}
</script>

<style scoped lang="scss">


.modal {
  position: fixed;
  cursor: auto;
  z-index: 1;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.7);

  .modal-content {
    background-color: #fff;
    width: 500px;
    margin: 250px auto;
    border-radius: 10px;
    padding: 40px;

    @media screen and (max-width: 560px) {
      width: 90%;
    }

    .modal-body {
        width: 80%;
        margin: 0 auto;

      p.modal-title {
        text-align: center;
        font-weight: bold;
        font-size: 1.2em;
        color: #333333;
        margin-bottom: 30px;

        @media screen and (max-width: 560px) {
          font-size: 1.2em;
        }
      }

      p.modal-text {
        color: #333333;
        font-size: 0.8em;
        text-align: left;
        margin: 15px 0 5px 0;
      }


      .ok-btn {
        display: block;
        margin: 30px auto 10px auto;
        background-color: #b33900;
        padding: 10px 18px;
        border-radius: 3px;
        color: #fff;
        font-size: 0.8em;
        text-align: center;

        &:hover {
          opacity: 0.8;
        }

      }
      .cancel-btn {
        display: block;
        margin: 20px auto 0 auto;
        background-color: #3a3a3a;
        padding: 10px 18px;
        border-radius: 3px;
        color: #fff;
        font-size: 0.8em;
        text-align: center;

        &:hover {
          opacity: 0.8;
        }

      }

    }


  }

  }
</style>
