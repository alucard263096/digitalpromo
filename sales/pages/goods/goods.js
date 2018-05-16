// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { GoodsApi } from "../../apis/goods.api";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=1;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var api = new GoodsApi();
    api.info({ id: this.Base.options.id }, (info) => {
      var content = this.Base.util.HtmlDecode(info.content);
      this.Base.setMyData(info);
      WxParse.wxParse('content', 'html', content, that, 10);
    });
  }
  chooseQRCode(){
    wx.navigateTo({
      url: '/pages/qrcodechoose/qrcodechoose?goods_id='+this.Base.options.id,
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.chooseQRCode = content.chooseQRCode;
Page(body)