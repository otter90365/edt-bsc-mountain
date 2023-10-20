<template>
  <div class="deco-border-wrap">
    <v-card class="rounded-0 shaped-card border-yellow">
      <v-card class="rounded-0 shaped-card secondary corner-yellow">
        <v-card class="py-5 px-4 px-sm-7 rounded-0 shaped-card main-content">
          <slot name="content"></slot>
        </v-card>
      </v-card>
    </v-card>
  </div>
</template>

<style lang="scss">
.deco-border-wrap {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: -10px;
    left: -10px;
    z-index: 2;
    background: url(../assets/img/deco-border-left-top.svg) no-repeat;
  }
  &::after {
    content: "";
    position: absolute;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    top: 0;
		left: 0;
    z-index: 2;
    background: url(../assets/img/deco-border-right-bottom.svg) right bottom no-repeat;
  }

  .shaped-card {
    &.border-yellow {
      background: var(--v-primary-base);
      padding: 1px;
    }
    &::before {
      position: absolute;
      content: "";
      width:0;
      height:0;
      border-width: 0 25px 25px 0;
      border-style: solid;
      border-color: transparent transparent var(--v-secondary-base);
      transform: rotate(180deg);
      top: 0;
      right: 0;
      z-index: 2;
    }
    &::after {
      position: absolute;
      content: "";
      width:0;
      height:0;
      border-width: 0 25px 25px 0;
      border-style: solid;
      border-color: transparent transparent var(--v-secondary-base);
      bottom: 0;
      left: 0;
    }
    .corner-yellow {
      padding: 15px;
      &::before, &::after {
        border-color: transparent transparent var(--v-primary-base);
      }
      &::before {
        z-index: 1;
      }
    }
  }
  .main-content {
    & > * {
      position: relative;
      z-index: 20;
    }
  }
}
</style>
