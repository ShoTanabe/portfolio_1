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
                  <div :class="[(comment.userId === currentUser.id) ? 'mycomment' : 'comment']">
                    <p>{{ comment.comment }}</p>
                    <p
                    v-if="comment.clipFile"
                    class="file-name">
                      <a :href="comment.clipUrl" target="_blank"><i class="far fa-file"></i> {{ comment.clipFile }}</a>
                    </p>
                  </div>
                  <p class="posting-time">{{ comment.commentTime }}</p>
                </div>
              </div>
            </div>
            <div
            v-if="clipBox"
            class="clip-box">
              <input type="file" name="clip-file" id=""
              @change="selectFile">
            </div>
            <div class="modal-textbox clearfix">
              <textarea name="comment"
              v-model="comment"></textarea>
              <div class="buttons">
                <div :class="[(this.clipBox === true) ? 'clip-btn-active' : 'clip-btn']"
                @click="switchClipBox">
                  <p v-html="clipBtnFont"></p>
                </div>
                <div class="comment-btn"
                @click="addComment">
                  <i class="fas fa-share"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
  } from "firebase/storage";

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
      commentsData: [],
      clipBox: false,
      selectedFile: ''
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

          if (commentData.userId === member.id) {
            const comment = {
              userId: commentData.userId,
              userName: member.name,
              userIcon: member.iconPath,
              comment: commentData.comment,
              clipFile: commentData.clipFile,
              clipUrl: commentData.clipUrl,
              timestamp: commentData.timestamp,
              commentTime: commentData.commentTime
            }
            comments.push(comment);
          }

        })

      })
      return comments;
    },
    clipBtnFont() {
      let clipBtnFont = '';
      if(this.clipBox === true) {
        clipBtnFont = '<i class="fas fa-times"></i>'
      } else if (this.clipBox === false) {
        clipBtnFont = '<i class="fas fa-paperclip"></i>'
      }
      return clipBtnFont;
    }
  },
  methods: {
    switchClipBox() {
      if(this.clipBox === false) {
        this.clipBox = true;
      } else if(this.clipBox === true) {
        this.clipBox = false;
      }
    },
    selectFile(event) {
      this.selectedFile = event.target.files[0];
    },

    addComment() {
      if(this.comment !== '' ){

        if(this.selectedFile !== '') {

          const storage = getStorage();
          const fileName = this.selectedFile.name;
          const storageRef = ref(storage, "clip-files/" +  fileName + Date.now());
          const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            (error) => {
              switch (error.code) {
                case 'storage/unauthorized':
                  break;
                case 'storage/canceled':
                  break;
                case 'storage/unknown':
                  break;
              }
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                const newComment = {
                  userId: this.currentUser.id,
                  comment: this.comment,
                  clipFile: this.selectedFile.name,
                  clipUrl: downloadURL,
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
                          const commentTime = month + '月' + day + '日' + ' ' + [(hour >= 10) ? hour : '0' + hour] + ':' + [(min >= 10) ? min : '0' + min];

                          const commentData = {
                            id: doc.id,
                            userId: doc.data().userId,
                            comment: doc.data().comment,
                            clipFile: doc.data().clipFile,
                            clipUrl: doc.data().clipUrl,
                            timestamp: doc.data().timestamp.seconds,
                            commentTime: commentTime
                          }
                          commentsData.push(commentData)
                        })

                        commentsData.sort((m, n) => {
                          return m.timestamp - n.timestamp;
                        });

                        this.commentsData = commentsData;
                        this.comment = '';
                        this.selectedFile = '';
                        this.clipBox = false;
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

              });
            }
          );


        } else {
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
                    const commentTime = month + '月' + day + '日' + ' ' + [(hour >= 10) ? hour : '0' + hour] + ':' + [(min >= 10) ? min : '0' + min];

                    const commentData = {
                      id: doc.id,
                      userId: doc.data().userId,
                      comment: doc.data().comment,
                      clipFile: doc.data().clipFile,
                      clipUrl: doc.data().clipUrl,
                      timestamp: doc.data().timestamp.seconds,
                      commentTime: commentTime
                    }
                    commentsData.push(commentData)
                  })

                  commentsData.sort((m, n) => {
                    return m.timestamp - n.timestamp;
                  });

                  this.commentsData = commentsData;
                  this.comment = '';
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

        }


      }

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
          const commentTime = month + '月' + day + '日' + ' ' + [(hour >= 10) ? hour : '0' + hour] + ':' + [(min >= 10) ? min : '0' + min];

          const commentData = {
            id: doc.id,
            userId: doc.data().userId,
            comment: doc.data().comment,
            clipFile: doc.data().clipFile,
            clipUrl: doc.data().clipUrl,
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
        margin-bottom: 5px;

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

            div.comment {
              padding: 5px;
              font-size: 0.8em;
              border-radius: 5px;
              background-color: #deffff;
            }

            div.mycomment {
              padding: 5px;
              font-size: 0.8em;
              border-radius: 5px;
              background-color:#ffeddb;
            }

            p.file-name {
              margin-top: 5px;
              font-weight: bold;
              border: solid 1px #b5b5b5;
              border-radius: 5px;
              padding: 5px;
              width:-moz-fit-content; 
              width:fit-content; 
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
        text-align: left;
        width: 100%;

        textarea {
          font-size: 0.8em;
          padding: 2px;
          color: #333333;
          border: 1px #333333 solid;
          line-height: 1.5em;
          border-radius: 3px 3px 0 3px;
          resize: none;
          width: 90%;
          height: 70px;
          display: block;
          float: left;
        }

        div.buttons {
          float: left;
          width: 10%;

          div.clip-btn {
            width: 90%;
            margin: 2px auto;
            line-height: 38px;
            padding: 2px;
            border-radius: 0 3px 3px 0;
            font-size: 1em;
            color: #333333;
            background-color: #d4d4d4;
            text-align: center;
            border-radius:  50%;

            &:hover {
              opacity: 0.7;
              cursor: pointer;
            }

          }

          div.clip-btn-active {
            width: 100%;
            margin: 0 auto 4px auto;
            line-height: 38px;
            padding: 2px;
            border-radius: 0 3px 3px 0;
            font-size: 1em;
            color: #333333;
            background-color: #d4d4d4;
            text-align: center;
            border-radius: 0 0 50% 50%;

            &:hover {
              opacity: 0.7;
              cursor: pointer;
            }

          }

          div.comment-btn {
            line-height: 20px;
            padding: 2px;
            border-radius: 0 3px 3px 0;
            font-size: 0.8em;
            color: #fff;
            background-color: #444444;
            text-align: center;

            &:hover {
              opacity: 0.7;
              cursor: pointer;
            }

          }

        }


      }

      div.clip-box {
        background-color: #d4d4d4;
        font-size: 0.8em;
        padding: 8px 4px;
        border-radius: 3px 3px 0 0;
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
