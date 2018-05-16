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
    super.onLoad(options);
    this.Base.setMyData({
      name:"",
      summary:""
    });
  }
  onMyShow() {
    var that = this;
    var api = new QrcodeApi();
    if(this.Base.options.id!=undefined){
      api.info({id:this.Base.options.id}, (info) => {
        info.primary_id=info.id;
        this.Base.setMyData(info);
      });
    }
  }
  nameChange(e){
    var val=e.detail.value;
    this.Base.setMyData({name:val});
  }
  summaryChange(e) {
    var val = e.detail.value;
    this.Base.setMyData({ summary: val });
  }
  save(){
    var data=this.Base.getMyData();
    var goodsids = [];
    var goods = this.Base.getMyData().goods;
    for (var i = 0; i < goods.length; i++) {
      goodsids.push(goods[i].id);
    }
    data.goodsgrid=goodsids.join(",");
    var api = new QrcodeApi();
    api.update(data,(ret)=>{
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }else{
        this.Base.error("保存失败，请联系管理员");
      }
    })
  }
  removeGoods(e){
    var id=e.currentTarget.id;
    var ret=[];
    var goods=this.Base.getMyData().goods;
    for(var i=0;i<goods.length;i++){
      if(goods[i].id!=id){
        ret.push(goods[i]);
      }
    }

    this.Base.setMyData({goods:ret});
  }
  deletea() {
    var that=this;
    var data = this.Base.getMyData();
    var api = new QrcodeApi();

    wx.showModal({
      title: '提示',
      content: '是否确定删除？',
      success(e){
        if(e.confirm){

          api.deletea({ idlist: data.id }, (ret) => {
            if (ret.code == 0) {
              wx.navigateBack({

              })
            } else {
              that.Base.error("删除失败，请联系管理员");
            }
          })
        }
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.nameChange = content.nameChange;
body.summaryChange = content.summaryChange;
body.save = content.save;
body.removeGoods = content.removeGoods;
body.deletea = content.deletea;
Page(body)


