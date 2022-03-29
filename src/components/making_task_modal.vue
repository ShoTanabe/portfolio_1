<template>
      <div class="modal">
        <div class="modal-content">
          <div class="modal-body">
            <p class="modal-title">新しいタスクを追加</p>
            <p class="modal-text">タスク名</p>
            <p v-if="showTaskNameError" class="error-messages">タスク名を入力してください</p>
            <p class="modal-textbox">
              <input type="textbox" name="taskName" value=""
              v-model="taskName"
              @focus="hideTaskNameError">
            </p>
            <p class="modal-text">タスク概要</p>
            <p class="modal-textbox">
              <textarea name="taskOutline" value="" wrap="soft"
              v-model="taskOutline">
              </textarea>
            </p>
            <p class="modal-text">終了日時</p>
            <p v-if="showFinishDateError" class="error-messages">終了日時を登録してください</p>
            <p class="modal-textbox">
              <input type="date" name="finishDate" value=""
              v-model="finishDate"
              @focus="hideFinishDateError">
            </p>
            <p class="modal-textbox mt5">
              <input type="time" name="finishTime" value=""
              v-model="finishTime"
              @focus="hideFinishDateError">
            </p>
            <p class="modal-text">責任者</p>
            <p class="modal-textbox">
              <select
              name="taskLeader"
              id="taskLeader"
              v-model="taskLeader">
                <option :value="null" disabled>--選択してください--</option>
                <option
                v-for="(member, i) in currentProject.projectMembers"
                :value="member.name"
                :key="member.name + i">{{ member.name }}</option>
              </select>
            </p>
            <button class="ok-btn" @click="createNewTask">タスクを追加</button>
            <button class="ok-btn" @click="closeMakingTaskModal">キャンセル</button>
          </div>
        </div>
      </div>
</template>

<script>
import {
  collection,
  addDoc,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  name: 'MakingTaskModal',
  data() {
    return {
      taskName: '',
      taskOutline: '',
      finishDate: '',
      finishTime: '',
      taskLeader: null,
      showTaskNameError: false,
      showFinishDateError: false,
}
  },
  computed: {
    currentProject() {
      return this.$store.getters.currentProject;
    },
    taskList() {
      return this.$store.getters.taskList;
    }
  },
  methods: {
    createNewTask() {
      if (this.taskName == '' && this.finishDate == '') {
        this.showTaskNameError = true;
        this.showFinishDateError = true;
      } else if (this.taskName == '') {
        this.showTaskNameError = true;
      } else if (this.finishDate == '') {
        this.showFinishDateError = true;
      } else {

        const newTask = {
          taskName: this.taskName,
          taskOutline: this.taskOutline,
          finishDate: this.finishDate,
          finishTime: this.finishTime,
          taskLeader: this.taskLeader,
        };

        addDoc(collection(getFirestore(), 'projects', this.currentProject.id, 'tasks'), newTask)
        .then(() => {
            getDocs(collection(getFirestore(), 'projects', this.currentProject.id, 'tasks'))
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
        )
        .catch(() => {
          console.log('store失敗')
        })
        this.$emit('closeMakingTaskModal');
      }
    },
    closeMakingTaskModal() {
      this.$emit('closeMakingTaskModal');
    },
    hideTaskNameError() {
      this.showTaskNameError = false;
    },
    hideFinishDateError() {
      this.showFinishDateError = false;
    }
  },
}
</script>

<style scoped lang="scss">

.modal {
  position: fixed;
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
          padding-left: 5px;
        }
        textarea {
          padding: 5px;
          font-size: 12px;
          color: #333333;
          border: 1px #bbbbbb solid;
          line-height: 1.5em;
          border-radius: 3px;
          width: 100%;
          height: 6em;
        }

        select {
          color: #333333;
          border: 1px #bbbbbb solid;
          line-height: 1.5em;
          border-radius: 3px;
          width: 100%;
          padding-left: 5px;
        }
      }

      p.mt5 {
        margin-top: 5px;
      }

      .user-select {
        margin-bottom: 3px;
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

      p.error-messages {
        color: red;
        font-size: 0.8em;
      }

    }


  }

}
</style>
