<template>
  <router-view/>
</template>

<script>
import Vue from 'vue'
import VueHead from 'vue-head'

Vue.use(VueHead)

export default {
  head: {
    link: [
      {rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.1/css/all.css'}
    ]
  }
}

</script>

<style lang="scss">

$btn-color: #5c5c5c;

* {
  box-sizing: border-box;
}

.container {
  width: 70%;
  margin: 0 auto;
  padding: 40px;
  box-sizing: border-box;

  h2 {
    color: #444444;
    text-align: center;
    font-size: 2.4em;
    font-weight: bold;
    margin-bottom: 80px;
  }

  .login-form {
    color: #444444;
    font-size: 1.2em;


    .input-group {
      margin: 20px 0;

      &::after {
        content: "";
        display: block;
        clear: both;
      }

      .input-title {
        width: 40%;
        float: left;
        text-align: right;
        padding: 2px 0;
      }

      .input-area {
        width: 60%;
        float: left;
      }

      input{
        border: solid 1px #9c9c9c;
        border-radius: 4px;
        padding: 2px 0;
        line-height: 24px;
        font-size: 0.8em;
      }
    }

    .input-btn {
      width: 170px;
      margin: 30px auto 10px auto;
      border-radius: 25px;
      border: 1px solid $btn-color;
      background-color: $btn-color;
      color: #fff;
      text-align: center;
      padding: 10px;
      position: relative;


      &:hover {
        border: 1px solid $btn-color;
        color: $btn-color;
        background-color: #fff;
      }
    }

    .sf-link {
      font-size: 0.8em;
      color: #3397f5;
      text-align: center;
      cursor: pointer;
      margin-top: 20px;

      &:hover {
        opacity: 0.7;
      }
    }

  }

  .message {
    text-align: center;
    font-size: 1.1em;
    margin-bottom: 10px;
  }

  .link {
    text-align: center;
    font-size: 0.8em;
    color: #3397f5;
    margin-bottom: 30px;
  }

  .flex-container {
    display: flex;
  }

}


.stretched-link {
  &::after{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    pointer-events: auto;
    content: "";
    background-color: rgba(0,0,0,0);
  }
}

.clearfix {
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}


</style>
