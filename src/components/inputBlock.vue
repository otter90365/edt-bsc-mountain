<template>
  <div class="input-block d-flex justify-start align-center">
    <div style="min-width: 80px" class="mb-5">{{ $t(title) }}</div>
    <!-- mode input-->
    <v-text-field
      v-if="mode==='input'"
      class="mr-4"
      v-model="text"
      outlined
      dense
      :disabled="disabled"
      :rules="rules"
      :color="`primary_${$route.params.token}`"
    ></v-text-field>

    <!-- mode balance-->
    <v-text-field
      v-else-if="mode==='balance'"
      class="mr-4"
      v-model="text"
      outlined
      dense
      persistent-hint
      :hint="`Balance: ${balance} ${token.toUpperCase()}`"
      :color="`primary_${$route.params.token}`"
      :disabled="disabled"
      :rules="[...rules, balanceRule]"
    >
      <template v-slot:append>
        <div @click="text=balance">Max</div>
      </template>
    </v-text-field>

    <!-- mode select-->
    <v-select
      v-else-if="mode==='select'"
      class="mr-4"
      v-model="text"
      outlined
      dense
      :items="selectItems"
      :item-text="'name'"
      :item-value="'value'"
      :disabled="disabled"
      :rules="rules"
      :color="`primary_${$route.params.token}`"
      :item-color="`primary_${$route.params.token}`"
    ></v-select>

    <!-- mode onlyText-->
    <div
      v-else-if="mode==='onlyText'"
      class="mr-4 mb-5"
      style="width: 100%;"
    >{{ inputText }}</div>
    <div class="mb-5" style="min-width: 30px">{{ unit }}</div>
  </div>
</template>
<script>
export default {
  name: 'input-block',
  props:{
    mode: {
      type: String,
      default: 'input'
    },
    title: String,
    unit: String,
    inputText: [String, Number],
    balance: Number,
    token: {
      type: String,
      default: 'eth',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default() {
        return []
      }
    },
    selectItems: {
      type: Array,
      default() {
        return [
          {
            name: '7',
            value: 7 * 24,
          },
          {
            name: '14',
            value: 14 * 24,
          },
          {
            name: '30',
            value: 30 * 24,
          },
          {
            name: '60',
            value: 60 * 24,
          },
          {
            name: '90',
            value: 90 * 24,
          },
          {
            name: '120',
            value: 120 * 24,
          },
          {
            name: '150',
            value: 150 * 24,
          },
          {
            name: '180',
            value: 180 * 24,
          },
        ]
      }
    }
  },
  data(){
    return {
      text: '',
      balanceRule: (v) => parseFloat(v) < this.balance || 'Under Balance' 
    }
  },
  watch:{
    text(newVal){
      this.$emit('update:inputText', newVal)
    },
    inputText(newVal){
      this.text = newVal
    }
  },
  mounted(){
    this.text = JSON.parse(JSON.stringify(this.inputText))
  }
}
</script>