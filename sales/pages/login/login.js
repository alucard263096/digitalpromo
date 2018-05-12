// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { SalesApi } from "../../apis/sales.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options); 
    this.Base.setMyData({
      mobile: "",
      verifycode: "",
      reminderResend: 0
    });
  }
  onShow() {
    var that = this;
    var mobile=wx.getStorageSync("loginmobile");
    if(mobile!=undefined){
      this.Base.setMyData({mobile});
    }
  }
  verifycodeChange(e) {
    this.Base.setMyData({ verifycode: e.detail.value });
  }
  mobileChange(e) {
    this.Base.setMyData({ mobile: e.detail.value });
  }
  sendVerifycode() {
    var mobile = "";
    var data = this.Base.getMyData();
    try {
      mobile = parseInt(data.mobile).toString();
    } catch (e) {

    }
    if (mobile[0] != "1" || mobile.length.toString() != "11") {
      this.Base.info("手机号码不正确，请重新输入");
      return;
    }
    var that = this;
    var salesApi = new SalesApi();
    salesApi.sendloginverifycode({ mobile: mobile },
      function (data) {
        if(data.code==0){
          that.Base.setMyData({ reminderResend: 60 });
          var interval = setInterval(function () {
            var reminderResend = that.data.reminderResend;
            reminderResend--;
            that.Base.setMyData({ reminderResend: reminderResend });
            if (reminderResend == 0) {
              clearInterval(interval);
            }
          }, 1000);
        } else if (data.code==-1){
          that.Base.info("亲，请先注册");
        }
      });
  }
  login(){
    var data = this.Base.getMyData();
    
    var mobile = "";
    try {
      mobile = parseInt(data.mobile).toString();
    } catch (e) {

    }
    if (mobile[0] != "1" || mobile.length.toString() != "11") {
      this.Base.info("请输入正确的手机号码");
      return;
    }
    if (data.verifycode.trim() == "") {
      this.Base.info("验证码不能为空");
      return;
    }
    var that = this;
    var salesApi = new SalesApi();
    salesApi.login({
      mobile: mobile,
      verifycode: data.verifycode
    }, function (data) {
      if (data.code == -501) {
        that.Base.error("验证码不正确");
        return;
      }
      if (data.code == -1) {
        that.Base.error("找不到注册号码，请确认号码后重新尝试");
        return;
      }
      ApiConfig.SetToken(data.token);
      wx.setStorageSync("loginmobile", mobile);
      wx.setStorageSync("logintoken", data.return.token);

    wx.navigateTo({
        url: '/pages/home/home',
      })
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onShow = content.onShow;
body.mobileChange = content.mobileChange;
body.verifycodeChange = content.verifycodeChange; 
body.sendVerifycode = content.sendVerifycode;
body.login = content.login;
Page(body)