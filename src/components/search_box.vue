<template>
  <div>
    <div class="search-box">
      <input placeholder="フリー検索" class="search-input" type="text">
      <div class="search-btn">
        <i class="fas fa-search"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBox'
}
</script>

<style scoped lang="scss">


.search-box {
  position: relative;
  width: 80%;
  margin: 0 auto;

  .search-input {
    padding-left: 1em;
    width: 90%;
    height: 28px;
    border-radius: 14px;
    border: solid 1px #bbbbbb;
    line-height: 1.4em;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 8px;
  }

  .search-btn {
    width: 37px;
    height: 28px;
    text-align: center;
    line-height: 30px;
    font-size: 1em;
    border-radius: 0 14px 14px 0;
    background-color: #999999;
    color: #fff;
    cursor: pointer;
    z-index: 1;
    position: absolute;
    top: 0px;
    right: 0;

    &:hover {
      opacity: 0.8;
    }

  }

}



</style>
