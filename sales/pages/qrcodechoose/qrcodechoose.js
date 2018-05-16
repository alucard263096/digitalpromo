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
  }
  onMyShow() {
    var that = this;
    var api = new QrcodeApi();
    api.list({},(list)=>{
      this.Base.setMyData({ list});
    });
  }
  addToQrcode(e){
    var qrcode_id=e.currentTarget.id;

    var api = new QrcodeApi();
    api.addgoods({ qrcode_id: qrcode_id, goods_id: this.Base.options.goods_id}, (ret) => {
      if(ret.code==0){
        this.Base.info("添加成功");
      }
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.addToQrcode = content.addToQrcode;
Page(body)