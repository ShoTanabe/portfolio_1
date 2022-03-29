<template>
    <div class="header clearfix">
      <div class="header-left">
        <img
          :src="this.currentUser.iconPath"
          @click="openEditingUserDataModal"
          alt=""
          class="user-icon">
        <p class="user-name">{{this.currentUser.name}} 様</p>
      </div>
      <div class="header-right">
        <div class="logout-btn" @click="logout">ログアウト</div>
      </div>
    </div>
</template>

<script>
import {
  getAuth,
  signOut
  } from "firebase/auth";
import {
  collection,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  name: 'HomeHeader',
  data() {
    return {
      userList: [],
      noImage: '',
      userIcon: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    currentUserIcon() {
      const currentUserEmail = this.$store.getters.currentUserEmail;
      let userIcon = '';
      this.userList.forEach((value) => {
        if(value.address === currentUserEmail) {
          userIcon = value.iconPath;
        }
        if(userIcon === '') {
          userIcon = 'https://firebasestorage.googleapis.com/v0/b/my-portfolio-c7f24.appspot.com/o/icon%2Fimage0.png?alt=media&token=d021e0f6-648b-4028-8436-8eec5cddf924';
        }
      });
      return userIcon;
    }
  },
  methods: {
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
          this.$store.commit('updateCurrentUser', '');
          this.$router.push('/');
      }).catch((error) => {
        console.log(error);
      });
    },
    openEditingUserDataModal() {
      this.$emit('openEditingUserDataModal');
    },
  },
  created() {
    getDocs(collection(getFirestore(), 'users'))
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          this.userList.push(doc.data());
        });
      })
      .catch(() => {
        console.log('「user」storeアクセス失敗')
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .header {
    height: 45px;
    padding-bottom: 5px;
    border-bottom: solid 1px #333333;

    .header-left {
      width: 50%;
      float: left;
      text-align: center;
      line-height: 40px;
      display: flex;
      justify-content: center;

      img {
        cursor: pointer;
      }

      .user-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .user-name {
        font-size: 0.9em;
        margin-left: 15px;
      }

    }
    .header-right {
      width: 50%;
      float: right;
      text-align: center;
    }
    .logout-btn {
      color: #fff;
      background-color: #d1d1d1;
      border-radius: 4px;
      width: 90px;
      font-size: 0.7em;
      padding: 8px;
      margin: 10px auto 0 auto;
      cursor: pointer;
    }
  }
</style>
