<template>
  <div>
    <el-row type='flex' justify='end'>
      <el-select size='mini'
                 @change='currentVal'
                 v-model='currentYear'
                 style='width: 90px'
      >
        <el-option v-for='item in years' :key='item' :label='item' :value='item'></el-option>
      </el-select>
      <el-select size='mini'
                 @change='currentVal'
                 v-model='currentMonth'
                 style='width: 90px;margin-left: 10px'
      >
        <el-option v-for='item in 12' :key='item' :label='item' :value='item'></el-option>
      </el-select>
    </el-row>
    <el-calendar v-model='currentDate'>
      <template v-slot:dateCell='{ date, data }' class='content'>
        <div class='date-content'>
          <span class='text'> {{ data.day | getDay }}</span>
          <span v-if='isWeek(date)' class='rest'>休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: '',
      years: [],
      currentYear: '',
      currentDate: null
    }
  },
  created() {
    this.getDate()
  },
  methods: {
    getDate() {
      const d = new Date()
      this.currentYear = d.getFullYear()
      this.currentMonth = d.getMonth() + 1
      this.years = Array.from(Array(11), (v, i) => (i + this.currentYear - 5))
    },
    currentVal() {
      const y = this.currentYear
      const m = this.currentMonth
      this.currentDate = new Date(`${y}-${m}-1`)
    },
    isWeek(value) {
      return value.getDay() === 0
    }
  }
}
</script>

<style scoped>
/deep/ .el-calendar-day {
  height: auto;
}

/deep/ .el-calendar-table__row td, /deep/ .el-calendar-table tr td:first-child, /deep/ .el-calendar-table__row td.prev {
  border: none;
}

.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}

.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}

.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;

}

/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}

/deep/ .el-calendar__header {
  display: none
}
</style>
