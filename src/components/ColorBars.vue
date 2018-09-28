<template>
  <div class="color-bar elevation-3">
    <table cellspacing=0px cellpadding=0px>
      <tr>
        <td style="background-color:#00a651" />
        <td style="background-color:#ed1c24" />
        <td style="background-color:#f57e25" />
        <td style="background-color:#009cd7" />
      </tr>
    </table>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.color-bar {
  width: 100%;
  height: 10px;
  background-color: red;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0;

  table {
    width: 100%;
    height: 100%;
  }

  tr {
    padding: 0;
    height: 100%;
  }

  td {
    width: 25%;
    height: 100%;
  }
}
</style>
