// pages/content/content.js
import { AppBase } from "../../appbase";
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
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onShow = content.onShow;
body.mobileChange = content.mobileChange;
body.verifycodeChange = content.verifycodeChange;
body.sendVerifycode = content.sendVerifycode;
Page(body)