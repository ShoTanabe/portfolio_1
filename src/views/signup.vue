<template>
  <div class="container">
    <h2>新規登録画面</h2>
    <form class="login-form">
      <p v-if="success" class="result-message">登録が完了しました</p>
      <p v-if="failed" class="result-message">登録できませんでした</p>
      <p v-if="alreadyUsed" class="result-message">このメールアドレスは使用済みです</p>
      <div class="input-group">
        <div class="input-title">
          <label for="name">ユーザー名：</label>
        </div>
        <div class="input-area">
          <input type="text" id="name" v-model="name" @focus="resetResultMessage">
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">
          <label for="email">メールアドレス：</label>
        </div>
        <div class="input-area">
          <input type="email" id="email" v-model="address" @focus="resetResultMessage">
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">
          <label for="password">パスワード：</label>
        </div>
        <div class="input-area">
          <input type="password" id="password" v-model="password" @focus="resetResultMessage">
        </div>
      </div>
      <div class="input-btn">
        <button class="stretched-link" type="button" @click="addUser">新規登録</button>
      </div>
      <div class="flex-container sns-btns">
        <div class="fb-btn" @click="facebookLogin"><i class="fab fa-facebook-f"></i> facebookで登録</div>
        <div class="tw-btn" @click="twitterLogin"><i class="fab fa-twitter"></i> twitterで登録</div>
      </div>
      <router-link to="/"><p class="sf-link">ログインはこちらから</p></router-link>
    </form>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  TwitterAuthProvider,
  FacebookAuthProvider
   } from "firebase/auth";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  data() {
    return {
      success: false,
      failed: false,
      alreadyUsed: false,
      name: '',
      address: '',
      password: '',
      iconPath: 'https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage0.png?alt=media&token=d021e0f6-648b-4028-8436-8eec5cddf924',
      userList:[]
    }
  },
  methods: {
    addUser() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.address, this.password)
        .then(() => {
          console.log('Auth完了');
          const userData = {
            name: this.name,
            address: this.address,
            password: this.password,
            iconPath: this.iconPath
          }
          addDoc(collection(getFirestore(), 'users'), userData)
          .then(() => {
            console.log('store完了')
            this.success = true;
            this.name = '';
            this.address = '';
            this.password = '';
            }
          )
          .catch(() => {
            console.log('store失敗')
          })
        })
        .catch((error) => {
          console.log('Auth失敗');
          this.failed = true;
          this.name = '';
          this.address = '';
          this.password = '';
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if(errorCode == 'auth/email-already-in-use') {
          this.alreadyUsed = true;
          }
          console.log(errorMessage);
        })
    },
    resetResultMessage() {
      this.success = false;
      this.failed = false;
      this.alreadyUsed = false;
    },
    twitterLogin() {
      const provider = new TwitterAuthProvider();

      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {

          // The signed-in user info.
          const user = result.user;

          getDocs(collection(getFirestore(), 'users'))
            .then((querySnapshot) => {
              this.userList = [];
              querySnapshot.forEach(doc => {
                this.userList.push(doc);
              });
              const list = this.userList;
              const userData = {
                name: user.displayName,
                address: user.email,
                password: '',
                iconPath: user.photoURL
              }
              if(list.some(list => list.data().address === user.email) === false){
                addDoc(collection(getFirestore(), 'users'), userData)
                .then((doc) => {
                  userData.id = doc.id;
                  this.$store.commit('updateCurrentUser', userData);
                  this.$router.push('/home');
                  }
                )
                .catch(() => {
                  console.log('store失敗')
                })
              } else {
                list.forEach(list => {
                  if(user.email === list.data().address) {
                    userData.id = list.id;
                    this.$store.commit('updateCurrentUser', userData);
                  }
                })
                  this.$router.push('/home');
              }
            })
            .catch(() => {
              console.log('storeアクセス失敗')
            })

          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode);
          console.log(errorMessage);

        });

    },
    facebookLogin() {
      const provider = new FacebookAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // The signed-in user info.
          const user = result.user;
          console.log(user);
          const userData = {
            name: user.displayName,
            address: user.email,
            password: '',
            iconPath: user.photoURL
          }
          getDocs(collection(getFirestore(), 'users'))
            .then((querySnapshot) => {
              this.userList = [];
              querySnapshot.forEach(doc => {
                this.userList.push(doc);
              });
              console.log(this.userList);
              const list = this.userList;
              if(list.some(list => list.data().address === user.email) === false){
                addDoc(collection(getFirestore(), 'users'), userData)
                .then((doc) => {
                  userData.id = doc.id;
                  this.$store.commit('updateCurrentUser', userData);
                  this.$router.push('/home');
                  }
                )
                .catch(() => {
                  console.log('store失敗')
                })
              } else {
                list.forEach(list => {
                  if(user.email === list.data().address) {
                    userData.id = list.id;
                    this.$store.commit('updateCurrentUser', userData);
                  }
                })
                  this.$router.push('/home');
              }
            })
            .catch(() => {
              console.log('storeアクセス失敗')
            })

        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);

        });

    }
  },
  created() {
    getDocs(collection(getFirestore(), 'users'))
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          this.userList.push(doc.data());
        });
      })
      .catch(() => {
        console.log('storeアクセス失敗')
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.result-message {
  color: red;
  text-align: center;
  font-size: 0.9em;
}

  .sns-btns {
    width: 410px;
    margin: 25px auto;

  }

  .fb-btn {
    background-color: #3b5998;
    color: #fff;
    padding: 10px;
    font-size: 0.9em;
    border-radius: 4px;
    width: 200px;
    text-align: center;
    cursor: pointer;
  }

  .tw-btn {
    margin-left: 10px;
    background-color: #00acee;
    color: #fff;
    padding: 10px;
    font-size: 0.9em;
    border-radius: 4px;
    width: 200px;
    text-align: center;
    cursor: pointer;
  }

</style>
