<template>
  <div class="loginPage">
    <img src="../assets/loginBg.jpg" alt="" class="bg" />
    <n-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      label-width="100px"
      label-align="right"
      label-placement="left"
      size="large"
      class="login"
    >
      <n-form-item label="用户名：" path="username">
        <n-input v-model:value="loginForm.username" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="密码：" path="password">
        <n-input v-model:value="loginForm.password" type="password" placeholder="请输入密码" />
      </n-form-item>
      <n-form-item label=" " class="btns">
        <n-button @click="onReset()">重置</n-button>
        <n-button type="primary" @click="onSubmit()">登录</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { FormInst } from 'naive-ui'
import { useRoute, useRouter } from "vue-router";
import { login } from "@/apis/index";
// import store from "@/store";
const route = useRoute();
const router = useRouter();
const loginRef = ref<FormInst | null>(null);
const loginForm = ref({
  username: "18812345678",
  password: "123456",
});
const loginRules = {
  username: { required: true, message: "用户名不能为空", trigger: ['blur', 'change'] },
  password: { required: true, message: "密码不能为空", trigger: ['blur', 'change'] },
};
const onSubmit = async () => {
  loginRef.value?.validate((errors) => {
    if (!errors) {
      login({
        mobile: loginForm.value.username,
        password: loginForm.value.password,
      }).then((res: any) => {
        localStorage.setItem("token", res.token);
        const path: any = route.query.redirect || "/activity/list";
        router.push(path);
      });
    } else {
      console.log(errors)
    }
  })
};
const onReset = () => {
  loginForm.value = {
    username: "",
    password: "",
  }
  // loginRef.resetFields();
};
</script>

<style lang="scss" scoped>
.loginPage {
  height: 100%;
  position: relative;
  overflow: hidden;
  .bg {
    position: absolute;
    left: 50%;
    top: 50%;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
  }
}
.login {
  width: 400px;
  height: 180px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  border: solid 1px #eee;
  background: #fff;
  border-radius: 6px;
  padding: 30px;
  text-align: left;
  .btns {
    text-align: center;
    .n-button {
      margin-right: 20px;
    }
  }
}
</style>
