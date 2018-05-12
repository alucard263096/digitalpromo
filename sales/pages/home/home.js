// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { BannerApi } from "../../apis/banner.api";
import { MerchantApi } from "../../apis/merchant.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow(){
    var that=this;
    var bannerapi=new BannerApi();
    bannerapi.indextop({},(indextop)=>{
      this.Base.setMyData({indextop});
    });

    var merchantapi=new MerchantApi();
    merchantapi.categories({},(categories)=>{
      this.Base.setMyData({ categories });
    });
    merchantapi.indexrecomm({}, (indexrecomm) => {
      this.Base.setMyData({ indexrecomm });
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)