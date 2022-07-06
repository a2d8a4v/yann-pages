!function(){"use strict";var e,t={502:function(e,t,a){var n=window.wp.blocks,l=JSON.parse('{"$schema":"https://json.schemastore.org/block.json","apiVersion":2,"name":"yannyann-box/points","title":"Points Box","icon":"ellipsis","category":"common","attributes":{"title_a":{"type":"string","source":"html","selector":"span.yann-points-span-a"},"text_a":{"type":"string","source":"html","selector":"p.yann-points-p-a"},"title_b":{"type":"string","source":"html","selector":"span.yann-points-span-b"},"text_b":{"type":"string","source":"html","selector":"p.yann-points-p-b"},"title_c":{"type":"string","source":"html","selector":"span.yann-points-span-c"},"text_c":{"type":"string","source":"html","selector":"p.yann-points-p-c"},"title_d":{"type":"string","source":"html","selector":"span.yann-points-span-d"},"text_d":{"type":"string","source":"html","selector":"p.yann-points-p-d"}},"editorScript":"file:./build/index.js","editorStyle":"file:./build/style-index.css","style":"file:./build/index.css"}'),r=window.wp.element,i=window.wp.i18n,c=window.wp.blockEditor,s=window.wp.components,m=a(686),o=a(336),p=a(674),u=a(656);const{name:d}=l;(0,n.registerBlockType)(d,{edit:e=>{const{attributes:{title_a:t,text_a:a,title_b:n,text_b:l,title_c:m,text_c:o,title_d:p,text_d:u,mediaURL_a:d,mediaID_a:g,mediaURL_b:_,mediaID_b:b,mediaURL_c:h,mediaID_c:E,mediaURL_d:v,mediaID_d:x},setAttributes:N}=e,y=(0,c.useBlockProps)();return(0,r.createElement)("div",y,(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",null,(0,r.createElement)(c.MediaUpload,{onSelect:e=>{N({mediaURL_a:e.url,mediaID_a:e.id})},allowedTypes:"image",value:g,render:e=>{let{open:t}=e;return(0,r.createElement)(s.Button,{className:"image-button",onClick:t},g?(0,i.__)("Change Image","gutenberg-examples"):(0,i.__)("Upload Image","gutenberg-examples"))}})),(0,r.createElement)(c.RichText,{tagName:"span",placeholder:(0,i.__)("Enter Some Big Text…","gutenberg-examples"),value:t,onChange:e=>{N({title_a:e})}}),(0,r.createElement)(c.RichText,{tagName:"p",placeholder:(0,i.__)("Enter Some Normal Text…","gutenberg-examples"),value:a,onChange:e=>{N({text_a:e})}})),(0,r.createElement)("br",null),(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",null,(0,r.createElement)(c.MediaUpload,{onSelect:e=>{N({mediaURL_b:e.url,mediaID_b:e.id})},allowedTypes:"image",value:b,render:e=>{let{open:t}=e;return(0,r.createElement)(s.Button,{className:"image-button",onClick:t},b?(0,i.__)("Change Image","gutenberg-examples"):(0,i.__)("Upload Image","gutenberg-examples"))}})),(0,r.createElement)(c.RichText,{tagName:"span",placeholder:(0,i.__)("Enter Some Big Text…","gutenberg-examples"),value:n,onChange:e=>{N({title_b:e})}}),(0,r.createElement)(c.RichText,{tagName:"p",placeholder:(0,i.__)("Enter Some Normal Text…","gutenberg-examples"),value:l,onChange:e=>{N({text_b:e})}})),(0,r.createElement)("br",null),(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",null,(0,r.createElement)(c.MediaUpload,{onSelect:e=>{N({mediaURL_c:e.url,mediaID_c:e.id})},allowedTypes:"image",value:E,render:e=>{let{open:t}=e;return(0,r.createElement)(s.Button,{className:"image-button",onClick:t},E?(0,i.__)("Change Image","gutenberg-examples"):(0,i.__)("Upload Image","gutenberg-examples"))}})),(0,r.createElement)(c.RichText,{tagName:"span",placeholder:(0,i.__)("Enter Some Big Text…","gutenberg-examples"),value:m,onChange:e=>{N({title_c:e})}}),(0,r.createElement)(c.RichText,{tagName:"p",placeholder:(0,i.__)("Enter Some Normal Text…","gutenberg-examples"),value:o,onChange:e=>{N({text_c:e})}})),(0,r.createElement)("br",null),(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",null,(0,r.createElement)(c.MediaUpload,{onSelect:e=>{N({mediaURL_d:e.url,mediaID_d:e.id})},allowedTypes:"image",value:x,render:e=>{let{open:t}=e;return(0,r.createElement)(s.Button,{className:"image-button",onClick:t},x?(0,i.__)("Change Image","gutenberg-examples"):(0,i.__)("Upload Image","gutenberg-examples"))}})),(0,r.createElement)(c.RichText,{tagName:"span",placeholder:(0,i.__)("Enter Some Big Text…","gutenberg-examples"),value:p,onChange:e=>{N({title_d:e})}}),(0,r.createElement)(c.RichText,{tagName:"p",placeholder:(0,i.__)("Enter Some Normal Text…","gutenberg-examples"),value:u,onChange:e=>{N({text_d:e})}})))},save:e=>{const{attributes:{title_a:t,text_a:a,title_b:n,text_b:l,title_c:i,text_c:s,title_d:d,text_d:g,mediaURL_a:_,mediaURL_b:b,mediaURL_c:h,mediaURL_d:E}}=e,v=c.useBlockProps.save({className:"yann-points"});return(0,r.createElement)("div",v,(0,r.createElement)("div",{className:"yann-points-container"},(0,r.createElement)("div",{className:"yann-points-wrapper"},(0,r.createElement)("div",null,(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",{className:"thumbnail"},(0,r.createElement)("div",{className:"thumb-img thumb-img-1",style:{"background-image":"url("+(_||m)+")"}}),(0,r.createElement)("div",{className:"thumb-border"})),(0,r.createElement)("h3",null,(0,r.createElement)(c.RichText.Content,{tagName:"span",className:"yann-points-span-a",value:t}),(0,r.createElement)("br",null),(0,r.createElement)(c.RichText.Content,{tagName:"p",className:"yann-points-p-a",value:a}))),(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",{className:"thumbnail"},(0,r.createElement)("div",{className:"thumb-img thumb-img-2",style:{"background-image":"url("+(b||o)+")"}}),(0,r.createElement)("div",{className:"thumb-border"})),(0,r.createElement)("h3",null,(0,r.createElement)(c.RichText.Content,{tagName:"span",className:"yann-points-span-b",value:n}),(0,r.createElement)("br",null),(0,r.createElement)(c.RichText.Content,{tagName:"p",className:"yann-points-p-b",value:l})))),(0,r.createElement)("div",null,(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",{className:"thumbnail"},(0,r.createElement)("div",{className:"thumb-img thumb-img-3",style:{"background-image":"url("+(h||p)+")"}}),(0,r.createElement)("div",{className:"thumb-border"})),(0,r.createElement)("h3",null,(0,r.createElement)(c.RichText.Content,{tagName:"span",className:"yann-points-span-c",value:i}),(0,r.createElement)("br",null),(0,r.createElement)(c.RichText.Content,{tagName:"p",className:"yann-points-p-c",value:s}))),(0,r.createElement)("div",{className:"point"},(0,r.createElement)("div",{className:"thumbnail"},(0,r.createElement)("div",{className:"thumb-img thumb-img-4",style:{"background-image":"url("+(E||u)+")"}}),(0,r.createElement)("div",{className:"thumb-border"})),(0,r.createElement)("h3",null,(0,r.createElement)(c.RichText.Content,{tagName:"span",className:"yann-points-span-d",value:d}),(0,r.createElement)("br",null),(0,r.createElement)(c.RichText.Content,{tagName:"p",className:"yann-points-p-d",value:g})))))))}})},656:function(e,t,a){e.exports=a.p+"images/artificial_intelligence_neural_networks.1f6fac95.png"},336:function(e,t,a){e.exports=a.p+"images/information_retrieval.b16c146d.png"},674:function(e,t,a){e.exports=a.p+"images/natural_language_processing.0fde5a54.png"},686:function(e,t,a){e.exports=a.p+"images/speech_signal_processing.f460b17d.png"}},a={};function n(e){var l=a[e];if(void 0!==l)return l.exports;var r=a[e]={exports:{}};return t[e](r,r.exports,n),r.exports}n.m=t,e=[],n.O=function(t,a,l,r){if(!a){var i=1/0;for(o=0;o<e.length;o++){a=e[o][0],l=e[o][1],r=e[o][2];for(var c=!0,s=0;s<a.length;s++)(!1&r||i>=r)&&Object.keys(n.O).every((function(e){return n.O[e](a[s])}))?a.splice(s--,1):(c=!1,r<i&&(i=r));if(c){e.splice(o--,1);var m=l();void 0!==m&&(t=m)}}return t}r=r||0;for(var o=e.length;o>0&&e[o-1][2]>r;o--)e[o]=e[o-1];e[o]=[a,l,r]},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var a=t.getElementsByTagName("script");a.length&&(e=a[a.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e}(),function(){var e={826:0,46:0};n.O.j=function(t){return 0===e[t]};var t=function(t,a){var l,r,i=a[0],c=a[1],s=a[2],m=0;if(i.some((function(t){return 0!==e[t]}))){for(l in c)n.o(c,l)&&(n.m[l]=c[l]);if(s)var o=s(n)}for(t&&t(a);m<i.length;m++)r=i[m],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(o)},a=self.webpackChunk_05_recipe_card_esnext=self.webpackChunk_05_recipe_card_esnext||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))}();var l=n.O(void 0,[46],(function(){return n(502)}));l=n.O(l)}();