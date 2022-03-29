<template>
      <div class="modal">
        <div class="modal-content">
          <div class="modal-body">
            <p class="modal-title">ユーザーアイコンを選択</p>
            <p class="modal-text">ユーザーアイコン</p>
            <div class="modal-textbox">
              <ul>
                <li
                  v-for="(iconData, i) in this.iconsData"
                  :key="iconData.id"
                  :id="iconData.id">
                  <input
                    v-model="iconPath"
                    type="radio"
                    name="iconSelect"
                    :value="iconData.data().url"
                    class="sizeSelectSmall"
                    :id="`${ iconData.id }_${ i }`"><label :for="`${ iconData.id }_${ i }`"></label>
                </li>
              </ul>
            </div>
            <button class="ok-btn" @click="editUserData()">アイコンを設定</button>
            <button class="cancel-btn" @click="closeModal()">キャンセル</button>
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
  getDoc,
  getDocs
 } from "firebase/firestore";

export default {
  name: 'EditingUserDataModal',
  data() {
    return {
      iconPath:'',
      iconsData: []
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    projectList() {
      return this.$store.getters.projectList;
    },
  },
  methods: {
    editUserData() {
      const editedUserData = {
        name: this.currentUser.name,
        address: this.currentUser.address,
        iconPath: this.iconPath,
        password: this.currentUser.password
      }
      setDoc(doc(getFirestore(), 'users', this.currentUser.id), editedUserData)
      .then(() => {
        getDoc(doc(getFirestore(), 'users', this.currentUser.id))
        .then((doc) => {
            const currentUserData = {
                id: doc.id,
                name: doc.data().name,
                address: doc.data().address,
                password: doc.data().password,
                iconPath: doc.data().iconPath
            }
            this.$store.commit('updateCurrentUser', currentUserData);
        })
        .catch(() => {
          console.log('データ取得失敗')
        })
      })
      .catch(() => {
        console.log('データ更新失敗')
      })

      this.projectList.forEach((project) => {

        project.projectMembers.forEach((memberData) => {
          if(memberData.name === this.currentUser.name) {
            memberData.iconPath = this.iconPath
          }

          const editedProjectData = {
            projectName: project.projectName,
            startDate: project.startDate,
            finishDate: project.finishDate,
            projectMembers: project.projectMembers
          }
          setDoc(doc(getFirestore(), 'projects', project.id), editedProjectData)
          .catch(() => {
            console.log('ストア「プロジェクト」更新失敗')
          })
        })

      })

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
      })
      .catch(() => {
          console.log('ストア「プロジェクト」データ取得失敗')
      })

      this.$emit('closeEditingUserDataModal');
    },
    closeModal() {
      this.$emit('closeEditingUserDataModal');
    },
    hideUserNameError() {
      this.showUserNameError = false;
    }
  },
  created() {
    getDocs(collection(getFirestore(), 'icons'))
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.iconsData.push(doc);
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

      div.modal-textbox {
        text-align: left;
        width: 100%;

        ul {
          display: flex;

          li {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-left: 5px;


            input[type=radio]+label:before {
              content: "";
              display: inline-block;
              background-size: contain;
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }

            input[type=radio]:checked+label::before{
                border: 3px solid #a62133;
                box-sizing: border-box;
            }

            input[type=radio]{
                display: none;
            }

            input[type=radio]#image001_1+label:before {
              background-image: url('https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage1.png?alt=media&token=6638bf54-5be3-49f2-8d38-bb68913f8e3f');
            }
            input[type=radio]#image002_2+label:before {
              background-image: url('https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage2.png?alt=media&token=3af9bbc4-fa27-4d94-9485-e1f3eb8eaf7a');
            }
            input[type=radio]#image003_3+label:before {
              background-image: url('https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage3.png?alt=media&token=bc680c01-ad24-4f6a-8879-ac5638c1b753');
            }
            input[type=radio]#image004_4+label:before {
              background-image: url('https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage4.png?alt=media&token=8244890a-3cdc-4dfb-988e-8a107b84ec79');
            }
            input[type=radio]#image005_5+label:before {
              background-image: url('https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage5.png?alt=media&token=cc900b16-1440-428a-a803-f486e636bfbf');
            }

          }
          li#image000 {
            display: none;
          }

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
