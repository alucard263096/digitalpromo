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
      name: "",
      reason:"",
      idcardno: "",
      idcard: "",
      idcardback: "",
      idcardinhand: "",
      mobile: "",
      verifycode: "",
      reminderResend: 0
    });
  }
  onShow() {
    var that = this;

    if (this.Base.options.mobile != undefined) {
      var salesapi = new SalesApi();
      salesapi.infobymobile({ mobile: this.Base.options.mobile }, (ret) => {
        ret.primary_id = ret.id;
        var status=this.Base.getMyData().status;
        if(ret.status=='A'){

          ApiConfig.SetToken(ret.token);
          wx.setStorageSync("loginmobile", ret.mobile);
          wx.setStorageSync("logintoken", ret.token);

          wx.navigateTo({
            url: '/pages/home/home',
          })
        }
        if (status != ret.status) {
          this.Base.setMyData(ret);
        }
      });
    }
  }
  verifycodeChange(e) {
    this.Base.setMyData({ verifycode: e.detail.value });
  } 
  mobileChange(e) {
    this.Base.setMyData({ mobile: e.detail.value });
  } 
  nameChange(e) {
    this.Base.setMyData({ name: e.detail.value });
  }
  reasonChange(e) {
    this.Base.setMyData({ reason: e.detail.value });
  }
  idcardnoChange(e) {
    this.Base.setMyData({ idcardno: e.detail.value });
  }
  idcardChoose(){
    var that=this;
    this.Base.uploadImage("sales",(ret)=>{
      that.Base.setMyData({idcard:ret});
    });
  }
  idcardbackChoose() {
    var that = this;
    this.Base.uploadImage("sales", (ret) => {
      that.Base.setMyData({ idcardback: ret });
    });
  }
  idcardinhandChoose() {
    var that = this;
    this.Base.uploadImage("sales", (ret) => {
      that.Base.setMyData({ idcardinhand: ret });
    });
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
    salesApi.sendregisterverifycode({ mobile: mobile },
      function (data) {
        if (data.code == 0) {
          that.Base.setMyData({ reminderResend: 60 });
          var interval = setInterval(function () {
            var reminderResend = that.data.reminderResend;
            reminderResend--;
            that.Base.setMyData({ reminderResend: reminderResend });
            if (reminderResend == 0) {
              clearInterval(interval);
            }
          }, 1000);
        } else if (data.code == -1) {
          that.Base.info("亲，你已经注册了，请返回登录");
        }
      });
  }
  register(){
    var data=this.Base.getMyData();
    if(data.name.trim()==""){
      this.Base.info("请输入真实姓名");
      return;
    }
    if (data.idcardno.trim() == "") {
      this.Base.info("请输入身份证号码");
      return;
    }
    if (data.idcard.trim() == "") {
      this.Base.info("请上传身份证正面");
      return;
    }
    if (data.idcardback.trim() == "") {
      this.Base.info("请上传身份证反面");
      return;
    }
    if (data.idcardinhand.trim() == "") {
      this.Base.info("请上传手持身份证照");
      return;
    }
    if (data.reason.trim() == "") {
      this.Base.info("请输入申请原因");
      return;
    }
    var mobile=data.mobile;
    if (mobile[0] != "1" || mobile.trim().length != 11) {
      this.Base.info("手机号码不正确，请重新输入");
      return;
    }
    if (data.verifycode.trim() == "" ) {
      this.Base.info("请输入验证码");
      return;
    }
    var salesApi = new SalesApi();
    salesApi.register(data,(ret)=>{
      if(ret.code==0){
        this.Base.info("提交成功，正在等待管理员审核");
        wx.setStorageSync("loginmobile", data.mobile);
        this.Base.setMyData({status:"R",status_name:"审核中"});
      }else{
        this.Base.info(ret.return);
      }
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onShow = content.onShow; 
body.nameChange = content.nameChange;
body.reasonChange = content.reasonChange;
body.idcardnoChange = content.idcardnoChange;
body.mobileChange = content.mobileChange;
body.verifycodeChange = content.verifycodeChange; 
body.sendVerifycode = content.sendVerifycode;
body.idcardChoose = content.idcardChoose;
body.idcardbackChoose = content.idcardbackChoose;
body.idcardinhandChoose = content.idcardinhandChoose;
body.register = content.register;
Page(body)