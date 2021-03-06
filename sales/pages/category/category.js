// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { MerchantApi } from "../../apis/merchant.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=1;
    //options.title="aaaa";
    super.onLoad(options);
    //this.Base.setMyData({title:});
    wx.setNavigationBarTitle({
      title: this.Base.options.title,
    })
  }
  onMyShow() {
    var that = this;

    var merchantapi = new MerchantApi();
    merchantapi.list({id:this.Base.options.id}, (list) => {
      this.Base.setMyData({ list });
    });
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)