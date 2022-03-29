<template>
      <div class="modal">
        <div class="modal-content">
        <button class="close-btn" @click="closeModal()"><i class="fas fa-times"></i></button>
          <div class="modal-body">
            <p class="modal-title">{{ currentTask.taskName }}</p>
            <p class="modal-outline">{{ currentTask.taskOutline }}</p>
            <div class="leader-and-deadline clearfix">
              <p class="leader modal-text">担当者：{{ currentTask.taskLeader }}</p>
              <p class="deadline modal-text">終了日時：{{ currentTask.finishDate }} {{ currentTask.finishTime }}</p>
            </div>
            <div class="chat-area">
              <div class="comment-box clearfix"
              v-for="(comment, i) in this.comments"
              :key="comment.timestamp+i">
                <div class="user-icon">
                  <div class="icon">
                    <img :src=comment.userIcon alt="error">
                  </div>
                  <p class="name">{{ comment.userName }}</p>
                </div>
                <div class="comment-time">
                  <p
                  :class="[comment.userId === currentUser.id ? 'mycomment' : 'comment']">
                  {{ comment.comment }}
                  </p>
                  <p class="posting-time">{{ comment.commentTime }}</p>
                </div>
              </div>
            </div>
            <div class="modal-textbox clearfix">
              <input type="text" name="comment" value=""
              v-model="comment">
              <div class="share-btn"
              @click="addComment">
                <i class="fas fa-share"></i>
              </div>
            </div>
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
  name: 'TaskDetailModal',
  data() {
    return {
      comment: '',
      commentsData: []
    }
  },
  computed: {
    currentTask() {
      return this.$store.getters.currentTask;
    },
    currentProject() {
      return this.$store.getters.currentProject;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    comments() {
      const comments = [];
      const members = this.currentProject.projectMembers;
      this.commentsData.forEach((commentData) => {

        members.forEach((member) => {

          if (commentData.userId == member.id) {
            const comment = {
              userId: commentData.userId,
              userName: member.name,
              userIcon: member.iconPath,
              comment: commentData.comment,
              timestamp: commentData.timestamp,
              commentTime: commentData.commentTime
            }
            comments.push(comment);
          }

        })

      })
      return comments;
    }
  },
  methods: {
    addComment() {
      const newComment = {
        userId: this.currentUser.id,
        comment: this.comment,
        timestamp: new Date(),
      }

      addDoc(collection(getFirestore(), 'projects', this.currentProject.id, 'tasks', this.currentTask.id, 'comments'), newComment)
      .then(() => {
          getDocs(collection(getFirestore(), 'projects', this.currentProject.id, 'tasks', this.currentTask.id, 'comments'))
          .then((querySnapshot) => {
              const commentsData = []
              querySnapshot.forEach((doc) => {

                const time = new Date( doc.data().timestamp.seconds * 1000);
                const month = time.getMonth() + 1;
                const day = time.getDate();
                const hour = time.getHours();
                const min = time.getMinutes();
                const commentTime = month + '月' + day + '日' + ' ' + hour + ':' + min;

                console.log(time);
                console.log(doc.data().timestamp.seconds);

                const commentData = {
                  id: doc.id,
                  userId: doc.data().userId,
                  comment: doc.data().comment,
                  timestamp: doc.data().timestamp.seconds,
                  commentTime: commentTime
                }
                commentsData.push(commentData)
              })

              commentsData.sort((m, n) => {
                return m.timestamp - n.timestamp;
              });

              this.commentsData = commentsData;
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

      this.comment = '';
    },
    closeModal() {
      const currentTask = {
        taskName: '',
        taskOutline: '',
        finishDate: '',
        finishTime: '',
        taskLeader: '',
        id: '',
        showTaskDetailModal: false,
      }
      this.$store.commit('updateCurrentTask', currentTask);
    }
  },
  created() {
    getDocs(collection(getFirestore(), 'projects', this.currentProject.id, 'tasks', this.currentTask.id, 'comments'))
    .then((querySnapshot) => {
        const commentsData = []
        querySnapshot.forEach((doc) => {

          const time = new Date( doc.data().timestamp.seconds * 1000);
          const month = time.getMonth() + 1;
          const day = time.getDate();
          const hour = time.getHours();
          const min = time.getMinutes();
          const commentTime = month + '月' + day + '日' + ' ' + hour + ':' + min;

          const commentData = {
            id: doc.id,
            userId: doc.data().userId,
            comment: doc.data().comment,
            timestamp: doc.data().timestamp.seconds,
            commentTime: commentTime
          }
          commentsData.push(commentData);
        })

        commentsData.sort((m, n) => {
          return m.timestamp - n.timestamp;
        });

        this.commentsData = commentsData;
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
    width: 600px;
    margin: 40px auto;
    border-radius: 10px;
    padding: 25px;
    position: relative;

    @media screen and (max-width: 560px) {
      width: 90%;
    }

  .close-btn {
      position: absolute;
      font-size: 2em;
      top: 10px;
      right: 15px;
      cursor: pointer;

    &:hover {
      opacity: 0.7;
    }

  }

    .modal-body {
      width: 500px;
      margin: 0 auto;

      p.modal-title {
        text-align: center;
        font-weight: bold;
        font-size: 1.6em;
        color: #333333;
        margin-bottom: 10px;

        @media screen and (max-width: 560px) {
          font-size: 1.2em;
        }
      }

      div.leader-and-deadline {
        margin-bottom: 20px;

        p.leader{
          float: left;
        }
        p.deadline{
          float: right;
        }
      }

      div.chat-area {
        height: 370px;
        border: solid 1px #333333;
        border-radius: 3px;
        padding: 10px;
        overflow-y: scroll;

        &::-webkit-scrollbar  {
          overflow:hidden;
          width: 5px;
          background:#fafafa;
          border-radius:10px;

          &:horizontal {
              height: 5px;
          }

        }

        &::-webkit-scrollbar-button {
          display:none;
        }

        &::-webkit-scrollbar-piece {
          background:#eee;
          &:start {
            background-color:#eee;
          }
        }

        &::-webkit-scrollbar-thumb {
          background:#b5b5b5;
          border-radius:10px;
        }

        &::-webkit-scrollbar-corner {
          background:#b5b5b5;
          border-radius:10px;
        }


        div.comment-box {
          margin: 15px 0;

          div.user-icon {
            float: left;
            width: 40px;

            img {
              border-radius: 50%;
              width: 40px;
              height: 40px;
            }

            p.name {
              font-size: 0.5em;
              text-align: center;
              margin-top: 5px;
            }
          }

          div.comment-time {
            float: left;
            width: 420px;
            margin-left: 10px;

            p.comment {
              padding: 5px;
              font-size: 0.8em;
              border-radius: 5px;
              background-color: #deffff;
            }

            p.mycomment {
              padding: 5px;
              font-size: 0.8em;
              border-radius: 5px;
              background-color:#ffeddb;
            }

            p.posting-time {
              font-size: 0.4em;
              text-align: right;
              margin-top: 5px;
            }

          }

        }

      }

      p.modal-text {
        color: #333333;
        font-size: 0.8em;
        text-align: left;
        margin: 15px 0 5px 0;
      }

      p.modal-outline {
        text-align: center;
        font-size: 0.9em;
        width: 100%;
      }

      div.modal-textbox {
        margin-top: 5px;
        text-align: left;
        width: 100%;

        input {
          font-size: 0.8em;
          padding: 1px 0;
          color: #333333;
          border: 1px #333333 solid;
          line-height: 1.5em;
          border-radius: 3px 0 0 3px;
          width: 90%;
          display: block;
          float: left;
        }

        div.share-btn {
          line-height: 1.5em;
          padding: 2px;
          border-radius: 0 3px 3px 0;
          font-size: 0.8em;
          color: #fff;
          background-color: #444444;
          text-align: center;
          float: left;
          width: 10%;

          &:hover {
            opacity: 0.7;
            cursor: pointer;
          }

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
