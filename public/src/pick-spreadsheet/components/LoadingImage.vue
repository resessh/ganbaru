<template>
  <div class="loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
@keyframes loading1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes loading3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

@keyframes loading2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}

.loading {
  display: block;
  position: relative;
  width: 64px;
  height: 64px;

  span {
    position: absolute;
    display: block;
    top: 27px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #dedede;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 6px;
      animation: loading1 0.6s infinite;
    }

    &:nth-child(2) {
      left: 6px;
      animation: loading2 0.6s infinite;
    }

    &:nth-child(3) {
      left: 26px;
      animation: loading2 0.6s infinite;
    }

    &:nth-child(4) {
      left: 45px;
      animation: loading3 0.6s infinite;
    }
  }
}
</style>
