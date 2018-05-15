// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { MerchantApi } from "../../apis/merchant.api";
import { SalesApi } from "../../apis/sales.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=1;
    super.onLoad(options);
    this.Base.setMyData({ currenttab: 0 });

    var merchantapi = new MerchantApi();
    merchantapi.goodsrecomm({ merchant_id: this.Base.options.id }, (goodsrecomm) => {
      this.Base.setMyData({ goodsrecomm: goodsrecomm });
    });
    merchantapi.goodscategory({ merchant_id: this.Base.options.id }, (goodscategory) => {
      goodscategory[goodscategory.length-1].selected=true;
      this.Base.setMyData({ goodscategory: goodscategory });
    });
  }
  onMyShow() {
    var that = this;

    var merchantapi = new MerchantApi();
    merchantapi.info({ id: this.Base.options.id }, (info) => {
      this.Base.setMyData(info);
    });
  }
  favoriteMerchant(){
    var salesapi = new SalesApi();
    salesapi.favorite({ merchant_id: this.Base.options.id }, (ret) => {
      this.Base.setMyData({ favorited: ret.return});
    });
  }
  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
  catSelected(e){
    console.log(e);
    var cat_id=e.currentTarget.id;
    var goodscategory = this.Base.getMyData().goodscategory;
    for(var i=0;i<goodscategory.length;i++){
      goodscategory[i].selected = goodscategory[i].id==cat_id;
    }
    this.Base.setMyData({ goodscategory: goodscategory });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab; 
body.favoriteMerchant = content.favoriteMerchant;
body.catSelected = content.catSelected;
Page(body)