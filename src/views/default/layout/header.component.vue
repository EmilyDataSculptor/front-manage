<template>
  <div class="header-component">
    <div class="l-left">
      <transition name="init">
        <div v-if="__menuCurrentPaths.length > 0" class="change-menu-collapse">
          <i :class="{'el-icon-s-fold':!__menuCollapseStatus,'el-icon-s-unfold':__menuCollapseStatus}"
             @click="__setMenuCollapseStatus(!__menuCollapseStatus)"/>
        </div>
      </transition>

      <div class="route-breadcrumb">
        <transition name="init">
          <el-breadcrumb separator="/" v-if="__menuCurrentPaths.length > 0">
            <el-breadcrumb-item :key="index" v-for="(item,index) in __menuCurrentPaths">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </transition>
      </div>
    </div>

    <div class="l-right">
      <div class="item">
        <i @click="toggleScreenFull" class="el-icon-full-screen"></i>
      </div>
      <div class="item">

        <el-dropdown @command="userActionHandleCommand">
        <span class="el-dropdown-link">
          <img class="avatar" :src="profilePicture" alt="">
          {{nickName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="个人中心">个人中心</el-dropdown-item>
            <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="item action-more">
        <i class="el-icon-more"></i>
      </div>
    </div>
  </div>
</template>

<script>

const screenFullLoad = () => import('screenfull');
import axios from 'axios';
export default {
  data() {
    return {
      nickName:'',
      profilePicture:'',
    };
  },

  created() {
    this.selectNickNameAndProfilePictureById();
    },

  methods: {

    selectNickNameAndProfilePictureById() { 
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      console.log('token', token); 
      console.log('id', id); 
      axios.post(this.$API_BASE_URL+'/user/selectNickNameAndProfilePictureById',{
          id:id
      }).then(response => { 
        console.log('response.data', response.data); 
        this.nickName=response.data.data.nickName;
        this.profilePicture=response.data.data.profilePicture;
        console.log('this.nickName',this.nickName); 
        console.log('this.profilePicture', this.profilePicture); 
      }).catch(error => {  
        console.error(error);  
    });
    },


    userActionHandleCommand(command) {
      switch (command) {
        case '个人中心':
          this.$router.push2({name: 'personal'});
          break;
        case '退出登录':
          this.$confirm('确认退出登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.__logout(this.$route);
          }).catch(() => {
          });
          break;
      }
    },
    /**
     * @description 切换全屏
     * */
    async toggleScreenFull() {
      const screenFullIns = await screenFullLoad();
      screenFullIns.toggle();
    },

  }
};
</script>

<style scoped lang="scss">
.router-transition-enter-active,
.router-transition-leave-active {
  transition: all .3s cubic-bezier(0, 0.1, 0.25, .8), opacity 1s ease-out;
  transform: translate(0, 0);
}

.router-transition-enter,
.router-transition-leave-to {
  opacity: 0;
  transform: translate(30%, 0);
}

</style>
