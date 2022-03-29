<template>
      <div class="modal">
        <div class="modal-content">
          <div class="modal-body">
            <p class="modal-title">プロジェクトを編集する</p>
            <p class="modal-text">プロジェクト名</p>
            <p v-if="showProjectNameError" class="error-messages">プロジェクト名を入力してください</p>
            <p class="modal-textbox">
              <input type="textbox" name="project-name" value=""
              v-model="projectName"
              @focus="hideProjectNameError">
            </p>
            <p class="modal-text">開始日</p>
            <p v-if="showStartDateError" class="error-messages">開始日を登録してください</p>
            <p class="modal-textbox">
              <input type="date" name="start-date" value=""
              v-model="startDate"
              @focus="hideStartDateError">
            </p>
            <p class="modal-text">終了日</p>
            <p v-if="showFinishDateError" class="error-messages">終了日を登録してください</p>
            <p v-if="showFinishDateError2" class="error-messages">開始日以前は登録できません</p>
            <p class="modal-textbox">
              <input type="date" name="finish-date" value=""
              v-model="finishDate"
              @focus="hideFinishDateError">
            </p>
            <p class="modal-text">参加ユーザー</p>
            <div class="modal-textbox">
              <div v-for="(userName, i) in userNames" :key="i" class="user-select">
                <label :for="userName+i">
                <input
                  :id="userName+i"
                  type="checkbox"
                  :value="userName"
                  v-model="members">
                {{ userName }}</label>
              </div>
            </div>
            <button class="ok-btn" @click="editProject(project)">プロジェクトを編集</button>
            <button class="cancel-btn" @click="closeModal(project)">キャンセル</button>
          </div>
        </div>
      </div>
</template>

<script>
import {
  doc,
  setDoc,
  collection,
  getFirestore,
  getDocs
 } from "firebase/firestore";

export default {
  name: 'EditingProjectModal',
  props: {
    project: {
      type: Object,
      default:()=>{}
    }
  },
  data() {
    return {
      projectName: this.project.projectName,
      startDate: this.project.startDate,
      finishDate: this.project.finishDate,
      members: [],
      showProjectNameError: false,
      showStartDateError: false,
      showFinishDateError: false,
      showFinishDateError2: false,
      projectsData: [],
      usersData: [],
      userNames: []
    }
  },
  computed: {
    projectList() {
      return this.$store.getters.projectList;
    }
  },
  methods: {
    editProject(project) {
      if (this.projectName == '' && this.startDate == '' && this.finishDate == '') {
        this.showProjectNameError = true;
        this.showStartDateError = true;
        this.showFinishDateError = true;
      } else if (this.projectName == '' && this.startDate == '') {
        this.showProjectNameError = true;
        this.showStartDateError = true;
      } else if (this.projectName == '' && this.finishDate == '') {
        this.showProjectNameError = true;
        this.showFinishDateError = true;
      } else if (this.startDate == '' && this.finishDate == '') {
        this.showStartDateError = true;
        this.showFinishDateError = true;
      } else if (this.projectName == '') {
        this.showProjectNameError = true;
      } else if (this.startDate == '') {
        this.showStartDateError = true;
      } else if (this.finishDate == '') {
        this.showFinishDateError = true;
      } else if (this.startDate > this.finishDate) {
        this.showFinishDateError2 = true;
      } else {

        const projectMembers = [];
        this.members.forEach((value) => {
          for(let i = 0; i <= this.usersData.length-1; i++){
            if(this.usersData[i].name == value){
              projectMembers.push({ id: this.usersData[i].id, name: this.usersData[i].name , iconPath:this.usersData[i].iconPath });
            }
          }
        })

        setDoc(doc(getFirestore(), 'projects', project.id), {
          projectName: this.projectName,
          startDate: this.startDate,
          finishDate: this.finishDate,
          projectMembers: projectMembers
        })
        .then(() => {
          getDocs(collection(getFirestore(), 'projects'))
          .then((querySnapshot) => {
                const projectsData = []
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
                  projectsData.push(projectData)
                })
                this.$store.commit('updateProjectList', projectsData);
            }
          )
          .catch(() => {
            console.log('データ取得失敗')
          })
        })
        .catch(() => {
          console.log('データ更新失敗')
        })
      }
    },
    closeModal(project) {
      this.$emit('closeEditingProjectModal',project);
    },
    hideProjectNameError() {
      this.showProjectNameError = false;
    },
    hideStartDateError() {
      this.showStartDateError = false;
    },
    hideFinishDateError() {
      this.showFinishDateError = false;
      this.showFinishDateError2 = false;
    }
  },
  created() {

    this.project.projectMembers.forEach((memberData) => {
      this.members.push(memberData.name)
    })

    getDocs(collection(getFirestore(), 'users'))
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const obtainedData = doc.data();
          obtainedData.id = doc.id;
          this.usersData.push(obtainedData);
          this.userNames.push(doc.data().name);
        })
      }
    )
    .catch(() => {
      console.log('データ取得失敗');
    })
  }
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
    margin: 100px auto;
    border-radius: 10px;
    padding: 25px;

    @media screen and (max-width: 560px) {
      width: 90%;
    }

    .modal-body {
        width: 60%;
        margin: 0 auto;

      p.modal-title {
        text-align: center;
        font-weight: bold;
        font-size: 1.3em;
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

      p.modal-textbox {
        text-align: left;
        width: 100%;

        input {
          color: #333333;
          border: 1px #bbbbbb solid;
          line-height: 1.5em;
          border-radius: 3px;
          width: 100%;
        }

      }

      .ok-btn {
        display: block;
        margin: 30px auto 10px auto;
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

      p.error-messages {
        color: red;
        font-size: 0.8em;
      }

    }


  }

  }
</style>
