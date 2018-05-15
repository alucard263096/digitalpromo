// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { QrcodeApi } from "../../apis/qrcode.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      name:"",
      summary:"",
      goods:[]
    });
  }
  onMyShow() {
    var that = this;
    var api = new QrcodeApi();
    if(this.Base.options.id!=undefined){
      api.info({id:this.Base.options.id}, (info) => {
        this.Base.setMyData(info);
      });
    }
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)