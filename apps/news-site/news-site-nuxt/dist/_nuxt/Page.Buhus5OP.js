import{o as n,c as a,a as o,t as f,n as l,h as _,_ as j,g as x,w as T,d as z,r as I,b as u,i as e,F as h,j as w,s as b,k as A,l as B,m as F,q as O,v as P,x as M,T as N}from"./entry.D8CqMrQy.js";const R=["href"],V={key:1},D={__name:"ArticleHeader",props:{headerClass:String,text:String,link:String},setup(t){return(m,d)=>t.text?(n(),a("header",{key:0,class:l(t.headerClass)},[t.link?(n(),a("a",{key:0,href:t.link},[o("h2",null,f(t.text),1)],8,R)):(n(),a("h2",V,f(t.text),1))],2)):_("",!0)}},L={},H={width:"24",height:"24",viewBox:"0 0 24 24"},q=o("title",null,"Lightning Icon",-1),E=o("path",{d:"M8 24l3-9h-9l14-15-3 9h9l-14 15z"},null,-1),p=[q,E];function G(t,m){return n(),a("svg",H,p)}const J=j(L,[["render",G]]),K={},Q={width:"24",height:"24",viewBox:"0 0 24 24"},U=o("title",null,"Play Icon",-1),W=o("path",{d:"M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"},null,-1),X=[U,W];function Y(t,m){return n(),a("svg",Q,X)}const Z=j(K,[["render",Y]]),tt={},et={width:"24",height:"24",viewBox:"0 0 24 24",fillRule:"evenodd",clipRule:"evenodd"},nt=o("title",null,"Fire Icon",-1),ct=o("path",{d:"M8.625 0c.61 7.189-5.625 9.664-5.625 15.996 0 4.301 3.069 7.972 9 8.004 5.931.032 9-4.414 9-8.956 0-4.141-2.062-8.046-5.952-10.474.924 2.607-.306 4.988-1.501 5.808.07-3.337-1.125-8.289-4.922-10.378zm4.711 13c3.755 3.989 1.449 9-1.567 9-1.835 0-2.779-1.265-2.769-2.577.019-2.433 2.737-2.435 4.336-6.423z"},null,-1),at=[nt,ct];function it(t,m){return n(),a("svg",et,at)}const lt=j(tt,[["render",it]]),$={__name:"ArticleText",props:{text:String,textClass:[String,Array],type:String},setup(t){return(m,d)=>t.text?(n(),x(I(t.type||"p"),{key:0,class:l(t.textClass)},{default:T(()=>[z(f(t.text),1)]),_:1},8,["class"])):_("",!0)}},st="_breaking_wx53j_106",ot="_watch_wx53j_110",rt="_horizontal_wx53j_160",ut="_vertical_wx53j_164",_t="_bullets_wx53j_174",i={"article-header":"_article-header_wx53j_1","article-body":"_article-body_wx53j_44","article-image-container":"_article-image-container_wx53j_62","article-image":"_article-image_wx53j_62","article-image-captions":"_article-image-captions_wx53j_86","article-image-tag":"_article-image-tag_wx53j_91",breaking:st,watch:ot,"article-title":"_article-title_wx53j_124","article-content":"_article-content_wx53j_133","article-list":"_article-list_wx53j_147","article-list-item":"_article-list-item_wx53j_155",horizontal:rt,vertical:ut,bullets:_t,"article-hero":"_article-hero_wx53j_189","article-list-content":"_article-list-content_wx53j_207"},dt={__name:"ArticleTag",props:{tag:Object},setup(t){return(m,d)=>{const s=J,r=Z,c=lt,g=$;return t.tag?(n(),a("div",{key:0,class:l([e(i)["article-image-tag"],e(i)[t.tag.type]])},[t.tag.type==="breaking"?(n(),x(s,{key:0})):_("",!0),t.tag.type==="watch"?(n(),x(r,{key:1})):_("",!0),t.tag.type==="new"?(n(),x(c,{key:2})):_("",!0),u(g,{text:t.tag.label},null,8,["text"])],2)):_("",!0)}}},mt=["src","width","height","alt"],S={__name:"ArticleImage",props:{image:Object,imageClass:String,meta:Object},setup(t){return(m,d)=>{var c,g;const s=dt,r=$;return n(),a(h,null,[t.image?(n(),a("div",{key:0,class:l(t.imageClass)},[o("img",{class:l(e(i)["article-image"]),src:t.image.src,width:t.image.width,height:t.image.height,alt:t.image.alt},null,10,mt),u(s,{tag:(c=t.meta)==null?void 0:c.tag},null,8,["tag"])],2)):_("",!0),u(r,{"text-class":e(i)["article-image-captions"],text:(g=t.meta)==null?void 0:g.captions},null,8,["text-class","text"])],64)}}},ht=["href"],xt=["href"],gt=["href"],yt={__name:"ArticleContent",props:{type:String,content:[String,Array],display:String},setup(t){return(m,d)=>{const s=$,r=S;return n(),a(h,null,[t.type==="text"?(n(),a("div",{key:0,class:l(e(i)["article-content"])},[u(s,{text:t.content},null,8,["text"])],2)):_("",!0),t.type==="list"?(n(),a("div",{key:1,class:l(e(i)["article-content"])},[o("ul",{class:l([e(i)["article-list"],e(i).vertical,{[e(i)[t.display]]:t.display}])},[(n(!0),a(h,null,w(t.content,c=>(n(),a("li",{key:c.id,class:l(e(i)["article-list-item"])},[c.url&&!c.title?(n(),a("a",{key:0,href:c.url},[u(s,{text:c.content},null,8,["text"])],8,ht)):(n(),x(s,{key:1,text:c.content},null,8,["text"]))],2))),128))],2)],2)):_("",!0),t.type==="articles-list"?(n(),a("div",{key:2,class:l(e(i)["article-list-content"])},[o("ul",{class:l([e(i)["article-list"],e(i).vertical])},[(n(!0),a(h,null,w(t.content,c=>(n(),a("li",{key:c.id,class:l(e(i)["article-list-item"])},[u(s,{"text-class":[e(i)["article-title"],"truncate-multiline","truncate-multiline-3"],text:c.title,type:"h3"},null,8,["text-class","text"]),c.url&&!c.title?(n(),a("a",{key:0,href:c.url},[u(s,{text:c.content},null,8,["text"])],8,xt)):(n(),x(s,{key:1,text:c.content},null,8,["text"]))],2))),128))],2)],2)):_("",!0),t.type==="excerpt"?(n(),a("ul",{key:3,class:l([e(i)["article-list"],e(i).horizontal])},[(n(!0),a(h,null,w(t.content,c=>(n(),a("li",{key:c.id,class:l(e(i)["article-list-item"])},[u(r,{"image-class":e(i)["article-hero"],image:c.image},null,8,["image-class","image"]),o("div",{class:l(e(i)["article-content"])},[u(s,{"text-class":["truncate-multiline","truncate-multiline-3"],text:c.text,type:"div"},null,8,["text"])],2)],2))),128))],2)):_("",!0),t.type==="grid"?(n(),a("div",{key:4,class:l([e(b)["grid-container"],{[e(b)[t.display]]:t.display}])},[(n(!0),a(h,null,w(t.content,c=>(n(),a("div",{key:c.id,class:l(e(b)["grid-item"])},[u(r,{"image-class":e(i)["article-image-container"],image:c.image,meta:c.meta},null,8,["image-class","image","meta"]),c.url?(n(),a("a",{key:0,href:c.url},[u(s,{"text-class":[e(i)["article-content"],"truncate-multiline","truncate-multiline-3"],text:c.text,type:"h3"},null,8,["text-class","text"])],8,gt)):(n(),x(s,{key:1,"text-class":[e(i)["article-content"],"truncate-multiline","truncate-multiline-3"],text:c.text,type:"h3"},null,8,["text-class","text"]))],2))),128))],2)):_("",!0),t.type==="preview"?(n(),a("ul",{key:5,class:l([e(i)["article-list"],e(i).vertical])},[(n(!0),a(h,null,w(t.content,c=>(n(),a("li",{key:c.id,class:l(e(i)["article-list-item"])},[u(r,{"image-class":e(i)["article-image-container"],image:c.image},null,8,["image-class","image"]),u(s,{"text-class":[e(i)["article-title"],"truncate-multiline","truncate-multiline-3"],text:c.title,type:"h3"},null,8,["text-class","text"])],2))),128))],2)):_("",!0)],64)}}},kt={__name:"Article",props:{article:Object},setup(t){return(m,d)=>{const s=D,r=S,c=$,g=yt;return n(),a("article",{class:l([e(b).column,e(b)[t.article.class],e(i).article])},[u(s,{"header-class":e(i)["article-header"],text:t.article.header,link:t.article.url},null,8,["header-class","text","link"]),o("section",{class:l(e(i)["article-body"])},[u(r,{"image-class":e(i)["article-image-container"],image:t.article.image,meta:t.article.meta},null,8,["image-class","image","meta"]),u(c,{"text-class":[e(i)["article-title"],"truncate-singleline"],text:t.article.title,type:"h3"},null,8,["text-class","text"]),u(g,{type:t.article.type,content:t.article.content,display:t.article.display},null,8,["type","content","display"])],2)],2)}}},wt=["id"],ft={__name:"Section",props:{section:Object},setup(t){return(m,d)=>{var r;const s=kt;return n(),a(h,null,[(r=t.section)!=null&&r.name?(n(),a("div",{key:0,id:t.section.id,class:l(e(b)["row-header"])},[o("h2",null,f(t.section.name),1)],10,wt)):_("",!0),o("section",{class:l(e(b).row)},[(n(!0),a(h,null,w(t.section.articles,(c,g)=>(n(),x(s,{key:`${t.section.id}-${g}`,article:c},null,8,["article"]))),128))],2)],64)}}},bt="_toast_1485w_1",vt="_open_1485w_17",k={toast:bt,open:vt,"toast-close-button":"_toast-close-button_1485w_24","toast-close-button-icon":"_toast-close-button-icon_1485w_36","toast-header":"_toast-header_1485w_43","toast-body":"_toast-body_1485w_54","toast-description":"_toast-description_1485w_61","toast-actions":"_toast-actions_1485w_78","toast-actions-button":"_toast-actions-button_1485w_83"},$t=o("span",{class:"animated-icon-inner"},[o("span"),o("span")],-1),jt=[$t],Ct=["id","onClick"],At={__name:"Toast",props:{onClose:Function,onAccept:Function,onReject:Function,notification:Object},setup(t){const{onClose:m,onAccept:d,onReject:s,notification:r}=t,c={accept:d,reject:s};return(g,v)=>(n(),a("div",{class:l([e(k).toast,e(k).open])},[o("button",{id:"close-toast-link",class:l(e(k)["toast-close-button"]),title:"Close Button",onClick:v[0]||(v[0]=(...y)=>t.onClose&&t.onClose(...y))},[o("div",{class:l([e(k)["toast-close-button-icon"],"animated-icon","close-icon","hover"]),title:"Close Icon"},jt,2)],2),t.notification.title?(n(),a("header",{key:0,class:l(e(k)["toast-header"])},[o("h2",null,f(t.notification.title),1)],2)):_("",!0),o("section",{class:l(e(k)["toast-body"])},[o("div",{class:l(e(k)["toast-description"])},f(t.notification.description),3),o("div",{class:l(e(k)["toast-actions"])},[(n(!0),a(h,null,w(t.notification.actions,y=>(n(),a("button",{id:`toast-${y.type}-button`,key:`toast-${y.type}-button`,class:l([e(A).button,e(A)[`${y.priority}-button`],e(k)["toast-actions-button"]]),onClick:c[y.type]},f(y.name),11,Ct))),128))],2)],2)],2))}},Tt={__name:"Page",props:{id:String},setup(t){const{id:m}=t,{content:d}=B("data"),s=F(!1);O(()=>{s.value=!!d[m].notification});function r(){s.value=!1}return(c,g)=>{const v=ft,y=At;return n(),a(h,null,[(n(!0),a(h,null,w(e(d)[t.id].sections,C=>(n(),x(v,{key:C.id,section:C},null,8,["section"]))),128)),(n(),x(N,{to:"body"},[e(d)[t.id].notification?P((n(),x(y,{key:0,"on-close":r,"on-accept":r,"on-reject":r,notification:e(d)[t.id].notification},null,8,["notification"])),[[M,s.value]]):_("",!0)]))],64)}}};export{Tt as _};
//# sourceMappingURL=Page.Buhus5OP.js.map
