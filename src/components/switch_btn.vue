<template>
  <div>
    <div class="switchArea">
      <input type="checkbox" id="switch1"
        v-model="checked"
        @click="changeSortType">
      <label for="switch1"><span></span></label>
      <div id="swImg"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwitchBtn',
  data() {
    return {
      checked: true,
    }
  },
  methods: {
    changeSortType() {
      this.$emit('changeSortType', this.checked)
    }
  }
}
</script>

<style scoped lang="scss">


 /* === ボタンを表示するエリア ============================== */
.switchArea {
  line-height    : 28px;                /* 1行の高さ          */
  letter-spacing : 0;                   /* 文字間             */
  text-align     : center;              /* 文字位置は中央     */
  font-size      : 11px;                /* 文字サイズ         */

  position       : relative;            /* 親要素が基点       */
  margin         : auto;                /* 中央寄せ           */
  width          : 95px;               /* ボタンの横幅       */
  background     : #888888;                /* デフォルト背景色   */
  border-radius: 14px;
}

 /* === チェックボックス ==================================== */
.switchArea input[type="checkbox"] {
  display        : none;            /* チェックボックス非表示 */
}

 /* === チェックボックスのラベル（標準） ==================== */
.switchArea label {
  display        : block;               /* ボックス要素に変更 */
  box-sizing     : border-box;          /* 枠線を含んだサイズ */
  height         : 28px;                /* ボタンの高さ       */
  border         : 1px solid #888888;   /* 未選択タブのの枠線 */
  border-radius  : 14px;                /* 角丸               */
}

 /* === チェックボックスのラベル（ONのとき） ================ */
.switchArea input[type="checkbox"]:checked +label {
  border-color   : #888888;             /* 選択タブの枠線     */
}

 /* === 表示する文字（標準） ================================ */
.switchArea label span:after{
  content        : "担当者";               /* 表示する文字       */
  padding        : 0 0 0 36px;          /* 表示する位置       */
  color          : #fff;             /* 文字色             */
}

 /* === 表示する文字（ONのとき） ============================ */
.switchArea  input[type="checkbox"]:checked + label span:after{
  content        : "日付";                /* 表示する文字       */
  padding        : 0 36px 0 0;          /* 表示する位置       */
  color          : #fff;             /* 文字色             */
}

 /* === 丸部分のSTYLE（標準） =============================== */
.switchArea #swImg {
  position       : absolute;            /* 親要素からの相対位置*/
  width          : 40px;                /* 丸の横幅           */
  height         : 20px;                /* 丸の高さ           */
  background     : #fff;             /* カーソルタブの背景 */
  top            : 4px;                 /* 親要素からの位置   */
  left           : 4px;                 /* 親要素からの位置   */
  border-radius  : 10px;                /* 角丸               */
  transition     : .2s;                 /* 滑らか変化         */
}

 /* === 丸部分のSTYLE（ONのとき） =========================== */
.switchArea input[type="checkbox"]:checked ~ #swImg {
  transform      : translateX(47px);    /* 丸も右へ移動       */
  background     : #fff;             /* カーソルタブの背景 */
}
</style>
