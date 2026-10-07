var I=globalThis,O=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),ue=new WeakMap,C=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(O&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=ue.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ue.set(e,t))}return t}toString(){return this.cssText}},me=a=>new C(typeof a=="string"?a:a+"",void 0,Y),w=(a,...t)=>{let e=a.length===1?a[0]:t.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[r+1],a[0]);return new C(e,a,Y)},ge=(a,t)=>{if(O)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=I.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,a.appendChild(i)}},G=O?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return me(e)})(a):a;var{is:je,defineProperty:We,getOwnPropertyDescriptor:Fe,getOwnPropertyNames:qe,getOwnPropertySymbols:Ke,getPrototypeOf:Ye}=Object,B=globalThis,ve=B.trustedTypes,Ge=ve?ve.emptyScript:"",Xe=B.reactiveElementPolyfillSupport,R=(a,t)=>a,X={toAttribute(a,t){switch(t){case Boolean:a=a?Ge:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},fe=(a,t)=>!je(a,t),be={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&We(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=Fe(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let d=s?.call(this);r?.call(this,n),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??be}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Ye(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,i=[...qe(e),...Ke(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(G(s))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ge(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:X).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:X;this._$Em=s;let d=n.fromAttribute(e,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let n=this.constructor;if(s===!1&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??fe)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,d=this[s];n!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[R("elementProperties")]=new Map,b[R("finalized")]=new Map,Xe?.({ReactiveElement:b}),(B.reactiveElementVersions??=[]).push("2.1.2");var se=globalThis,_e=a=>a,j=se.trustedTypes,xe=j?j.createPolicy("lit-html",{createHTML:a=>a}):void 0,Ae="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+y,Je=`<${Ee}>`,A=document,D=()=>A.createComment(""),L=a=>a===null||typeof a!="object"&&typeof a!="function",re=Array.isArray,Ze=a=>re(a)||typeof a?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ye=/-->/g,$e=/>/g,k=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,ke=/"/g,Me=/^(?:script|style|textarea|title)$/i,ae=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),l=ae(1),ne=ae(2),ft=ae(3),f=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Se=new WeakMap,S=A.createTreeWalker(A,129);function Te(a,t){if(!re(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return xe!==void 0?xe.createHTML(t):t}var Qe=(a,t)=>{let e=a.length-1,i=[],s,r=t===2?"<svg>":t===3?"<math>":"",n=P;for(let d=0;d<e;d++){let o=a[d],p,u,m=-1,v=0;for(;v<o.length&&(n.lastIndex=v,u=n.exec(o),u!==null);)v=n.lastIndex,n===P?u[1]==="!--"?n=ye:u[1]!==void 0?n=$e:u[2]!==void 0?(Me.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=k):u[3]!==void 0&&(n=k):n===k?u[0]===">"?(n=s??P,m=-1):u[1]===void 0?m=-2:(m=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?k:u[3]==='"'?ke:we):n===ke||n===we?n=k:n===ye||n===$e?n=P:(n=k,s=void 0);let x=n===k&&a[d+1].startsWith("/>")?" ":"";r+=n===P?o+Je:m>=0?(i.push(p),o.slice(0,m)+Ae+o.slice(m)+y+x):o+y+(m===-2?d:x)}return[Te(a,r+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},z=class a{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0,d=t.length-1,o=this.parts,[p,u]=Qe(t,e);if(this.el=a.createElement(p,i),S.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=S.nextNode())!==null&&o.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(Ae)){let v=u[n++],x=s.getAttribute(m).split(y),V=/([.?@])?(.*)/.exec(v);o.push({type:1,index:r,name:V[2],strings:x,ctor:V[1]==="."?Q:V[1]==="?"?ee:V[1]==="@"?te:M}),s.removeAttribute(m)}else m.startsWith(y)&&(o.push({type:6,index:r}),s.removeAttribute(m));if(Me.test(s.tagName)){let m=s.textContent.split(y),v=m.length-1;if(v>0){s.textContent=j?j.emptyScript:"";for(let x=0;x<v;x++)s.append(m[x],D()),S.nextNode(),o.push({type:2,index:++r});s.append(m[v],D())}}}else if(s.nodeType===8)if(s.data===Ee)o.push({type:2,index:r});else{let m=-1;for(;(m=s.data.indexOf(y,m+1))!==-1;)o.push({type:7,index:r}),m+=y.length-1}r++}}static createElement(t,e){let i=A.createElement("template");return i.innerHTML=t,i}};function E(a,t,e=a,i){if(t===f)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,r=L(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(a),s._$AT(a,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=E(a,s._$AS(a,t.values),s,i)),t}var Z=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);S.currentNode=s;let r=S.nextNode(),n=0,d=0,o=i[0];for(;o!==void 0;){if(n===o.index){let p;o.type===2?p=new N(r,r.nextSibling,this,t):o.type===1?p=new o.ctor(r,o.name,o.strings,this,t):o.type===6&&(p=new ie(r,this,t)),this._$AV.push(p),o=i[++d]}n!==o?.index&&(r=S.nextNode(),n++)}return S.currentNode=A,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},N=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),L(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==f&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ze(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=z.createElement(Te(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new Z(s,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=Se.get(t.strings);return e===void 0&&Se.set(t.strings,e=new z(t)),e}k(t){re(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new a(this.O(D()),this.O(D()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=_e(t).nextSibling;_e(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,s){let r=this.strings,n=!1;if(r===void 0)t=E(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==f,n&&(this._$AH=t);else{let d=t,o,p;for(t=r[0],o=0;o<r.length-1;o++)p=E(this,d[i+o],e,o),p===f&&(p=this._$AH[o]),n||=!L(p)||p!==this._$AH[o],p===c?t=c:t!==c&&(t+=(p??"")+r[o+1]),this._$AH[o]=p}n&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Q=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},ee=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},te=class extends M{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??c)===f)return;let i=this._$AH,s=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ie=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var et=se.litHtmlPolyfillSupport;et?.(z,N),(se.litHtmlVersions??=[]).push("3.3.3");var Ce=(a,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let r=e?.renderBefore??null;i._$litPart$=s=new N(t.insertBefore(D(),r),r,void 0,e??{})}return s._$AI(a),s};var oe=globalThis,$=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ce(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};$._$litElement$=!0,$.finalized=!0,oe.litElementHydrateSupport?.({LitElement:$});var tt=oe.litElementPolyfillSupport;tt?.({LitElement:$});(oe.litElementVersions??=[]).push("4.2.2");var Re={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Pe=a=>(...t)=>({_$litDirective$:a,values:t}),W=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var De="important",it=" !"+De,g=Pe(class extends W{constructor(a){if(super(a),a.type!==Re.ATTRIBUTE||a.name!=="style"||a.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(a){return Object.keys(a).reduce((t,e)=>{let i=a[e];return i==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(a,[t]){let{style:e}=a.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let i of this.ft)t[i]==null&&(this.ft.delete(i),i.includes("-")?e.removeProperty(i):e[i]=null);for(let i in t){let s=t[i];if(s!=null){this.ft.add(i);let r=typeof s=="string"&&s.endsWith(it);i.includes("-")||r?e.setProperty(i,r?s.slice(0,-11):s,r?De:""):e[i]=s}}return f}});var Le=[{id:"page",label:"Page background",summary:"page",toggle:"use_custom_background_color",colour:"custom_background_color"},{id:"card",label:"Cards",summary:"card",override:"card_bg_override"},{id:"bubble",label:"Bubble cards",summary:"bubble",override:"bubble_bg_override"},{id:"popup",label:"Pop-ups",cssVar:"bubble-pop-up-background-color",override:"popup_bg_override"},{id:"navbar",label:"Navbar",summary:"navbar",override:"navbar_bg_override"},{id:"accent",label:"Accent",summary:"accent",override:"accent_color_override"},{id:"slider",label:"Bubble slider",summary:"slider",override:"bubble_slider_color_override"},{id:"text",label:"Text",summary:"text",toggle:"use_custom_text_color",colour:"custom_text_color"},{id:"secondary",label:"Secondary text",summary:"secondary",override:"secondary_text_color_override"},{id:"icon",label:"Icons",summary:"icon",toggle:"use_custom_icon_color",colour:"custom_icon_color"},{id:"active",label:"Active icons",summary:"active",override:"state_icon_active_color_override"},{id:"navicon",label:"Navbar icons",summary:"nav_icon",toggle:"use_custom_navbar_icon_color",colour:"custom_navbar_icon_color"}],ze=[{id:"headerbg",label:"Header background",cssVar:"app-header-background-color",override:"app_header_background_color_override"},{id:"headertext",label:"Header text",cssVar:"app-header-text-color",override:"app_header_text_color_override"},{id:"secondarybg",label:"Secondary background",cssVar:"secondary-background-color",override:"secondary_background_color_override"},{id:"divider",label:"Dividers",cssVar:"divider-color",override:"divider_color_override"},{id:"sidebaricon",label:"Sidebar icons",cssVar:"sidebar-icon-color",override:"sidebar_icon_color_override"},{id:"disabled",label:"Disabled text",cssVar:"disabled-text-color",override:"disabled_text_color_override"}],le=[...Le,...ze],F={text_page:["text","page"],text_card:["text","card"],secondary_text_card:["secondary","text","card"],icon_card:["icon","card"],active_icon_card:["active","card"],text_bubble:["text","bubble"],icon_bubble:["icon","bubble"],text_popup:["text","popup"],navbar_icon:["navicon","navbar"],header_text:["headertext","headerbg"],sidebar_icon:["sidebaricon","page"],text_on_accent:["accent"],accent_page:["accent","page"],text_sub_button:["text","bubble"]},H=[{id:"colours",label:"Colours",icon:"palette",description:"Start with one base colour. Everything set to Auto is worked out from it and kept readable.",groups:[{id:"base",title:"Base colour",controls:[{type:"base"}]},{id:"adjust",title:"Adjust",controls:[{type:"slider",key:"contrast",label:"Contrast",ends:["Soft","Strong"]},{type:"slider",key:"saturation",label:"Saturation",ends:["Muted","Vivid"]},{type:"slider",key:"tone",label:"Tone",ends:["Darker","Lighter"]},{type:"slider",key:"hue_shift",label:"Hue shift"},{type:"slider",key:"accent_strength",label:"Accent strength"},{type:"slider",key:"neutrality",label:"Neutral surfaces",ends:["Tinted","Neutral"]},{type:"segmented",key:"preview_mode",label:"Style",options:[["Relaxed","Relaxed"],["Focused","Focused"],["Vibrant","Vibrant"]]},{type:"segmented",key:"color_model",label:"Colour model",options:[["hsl","Classic"],["oklch","Even (OKLCH)"]],hint:"Even keeps shades equally bright across colours, so a yellow and a blue theme feel the same."}]},{id:"roles",title:"Colours in use",hint:"Manual colours are never changed by Theme Studio. Tap a manual swatch to pick a colour.",controls:[{type:"roles",roles:Le}]},{id:"more",title:"More colours",collapsible:!0,controls:[{type:"roles",roles:ze}]},{id:"finetune",title:"Fine-tune per surface",collapsible:!0,controls:[{type:"slider",key:"surface_lift"},{type:"slider",key:"accent_contrast"},{type:"slider",key:"accent_hue_shift"},{type:"slider",key:"accent_saturation"},{type:"slider",key:"card_bg_contrast"},{type:"slider",key:"card_bg_hue_shift"},{type:"slider",key:"card_bg_saturation"},{type:"slider",key:"bubble_bg_contrast"},{type:"slider",key:"bubble_bg_hue_shift"},{type:"slider",key:"bubble_bg_saturation"},{type:"slider",key:"popup_bg_contrast"},{type:"slider",key:"popup_bg_hue_shift"},{type:"slider",key:"popup_bg_saturation"},{type:"slider",key:"bubble_slider_contrast"},{type:"slider",key:"bubble_slider_hue_shift"},{type:"slider",key:"bubble_slider_saturation"},{type:"slider",key:"bubble_slider_opacity"}]},{id:"mirror",title:"Light and Dark",controls:[{type:"mirror"}]}]},{id:"check",label:"Check",icon:"contrast",description:"Every text and icon colour against what it sits on.",groups:[]}];function q(a,t){if(a.override){let e=String(t[a.override]??"auto").trim().toLowerCase();return e!==""&&e!=="auto"}if(a.toggle){let e=t[a.toggle];return e===!0||e==="on"}return!1}function de(a,t){let e=a.override??a.colour;return e?String(t[e]??""):""}function ce(a,t){return a.override?{[a.override]:t}:a.toggle&&a.colour?{[a.toggle]:"on",[a.colour]:t}:{}}function pe(a){return a.override?{[a.override]:"auto"}:a.toggle?{[a.toggle]:"off"}:{}}var Ne=w`
  .btn.primary {
    background: var(--ts-ink);
    color: var(--ts-panel);
    border-color: var(--ts-ink);
  }
  .btn.primary:hover {
    opacity: 0.9;
    background: var(--ts-ink);
  }
  .btn.danger {
    color: var(--ts-warn);
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .name {
    font: inherit;
    font-size: 18px;
    font-weight: 700;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 8px;
    padding: 2px 8px;
    margin-left: -8px;
    color: var(--ts-ink);
    width: 100%;
    max-width: 420px;
    min-width: 0;
  }
  .name:hover:not(:disabled) {
    border-color: var(--ts-line);
  }
  .name:focus {
    outline: 2px solid var(--ts-sel);
  }
  .status.error {
    color: var(--ts-warn);
  }
  .editor {
    flex: 1;
    display: grid;
    grid-template-columns: 88px 384px minmax(0, 1fr);
    min-height: 0;
  }
  .rail {
    background: var(--ts-panel);
    border-right: 1px solid var(--ts-line);
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: auto;
  }
  .rail-btn {
    border: 0;
    background: transparent;
    border-radius: 14px;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ts-muted);
    cursor: pointer;
    position: relative;
    min-height: 62px;
  }
  .rail-btn:hover {
    background: var(--ts-panel2);
  }
  .rail-btn.on {
    background: var(--ts-sel-soft);
    color: var(--ts-sel);
  }
  .count {
    position: absolute;
    top: 5px;
    right: 12px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    background: var(--ts-warn);
    color: var(--ts-panel);
    font-size: 11px;
    font-weight: 700;
    display: grid;
    place-items: center;
    padding: 0 5px;
  }
  .ctl {
    background: var(--ts-panel);
    border-right: 1px solid var(--ts-line);
    overflow: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .chips {
    display: none;
    gap: 6px;
    padding: 10px 14px;
    overflow-x: auto;
    border-bottom: 1px solid var(--ts-line);
    flex: none;
  }
  .chip {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    border-radius: 999px;
    min-height: 40px;
    padding: 0 14px;
    font-weight: 600;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    cursor: pointer;
    color: var(--ts-muted);
    flex: none;
  }
  .chip.on {
    background: var(--ts-ink);
    color: var(--ts-panel);
    border-color: var(--ts-ink);
  }
  .chip .count {
    position: static;
  }
  .banner {
    margin: 16px 20px 0;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--ts-sel-soft);
    font-size: 13px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .banner svg {
    color: var(--ts-sel);
    flex: none;
    margin-top: 1px;
  }
  .sec {
    padding: 20px 20px 48px;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }
  .sh {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .sp {
    color: var(--ts-muted);
    margin-top: 4px;
  }
  .group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    text-align: left;
  }
  .group-head .h {
    margin: 0;
  }
  .group-head svg {
    color: var(--ts-muted);
    transition: transform 0.15s;
  }
  .group-head.open svg {
    transform: rotate(180deg);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .lbl {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
  }
  .ends {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--ts-muted);
  }
  input[type="range"] {
    width: 100%;
    accent-color: var(--ts-sel);
    height: 28px;
    margin: 0;
  }
  .base {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .swatch-big {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    border: 1px solid var(--ts-line);
    overflow: hidden;
    cursor: pointer;
    flex: none;
    position: relative;
    display: block;
  }
  .cpick {
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: pointer;
    opacity: 0;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .text-input {
    font-family: var(--ts-mono);
    font-size: 14px;
    height: 44px;
    border: 1px solid var(--ts-line);
    border-radius: 12px;
    padding: 0 12px;
    background: var(--ts-panel2);
    color: var(--ts-ink);
    width: 100%;
  }
  .text-input.plain {
    font-family: var(--ts-font);
  }
  .text-input:focus,
  select:focus {
    outline: 2px solid var(--ts-sel);
  }
  select.text-input {
    font-family: var(--ts-font);
  }
  .seg.full {
    display: flex;
  }
  .seg.full button {
    flex: 1;
  }
  .roles {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ts-line);
    border-radius: 16px;
    overflow: hidden;
  }
  .role {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-top: 1px solid var(--ts-line);
  }
  .role:first-child {
    border-top: 0;
  }
  .rs {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid var(--ts-line);
    overflow: hidden;
    position: relative;
  }
  .rs-lock {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: var(--ts-panel);
    color: var(--ts-ink);
    display: grid;
    place-items: center;
    pointer-events: none;
  }
  .mode {
    display: inline-flex;
    border: 1px solid var(--ts-line);
    border-radius: 10px;
    overflow: hidden;
  }
  .mode button {
    border: 0;
    background: transparent;
    font-size: 12.5px;
    font-weight: 600;
    padding: 0 10px;
    min-height: 36px;
    cursor: pointer;
    color: var(--ts-muted);
  }
  .mode button.on {
    background: var(--ts-ink);
    color: var(--ts-panel);
  }
  .mode button:disabled {
    cursor: default;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    text-align: left;
    border: 1px solid var(--ts-line);
    background: var(--ts-panel2);
    border-radius: 16px;
    padding: 12px 14px;
    cursor: pointer;
    width: 100%;
  }
  .switch {
    width: 46px;
    height: 28px;
    border-radius: 14px;
    background: var(--ts-line);
    position: relative;
    flex: none;
    transition: background 0.15s;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    transition: left 0.15s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  }
  .switch.on {
    background: var(--ts-sel);
  }
  .switch.on::after {
    left: 21px;
  }
  .crow {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-top: 1px solid var(--ts-line);
  }
  .crow:first-child {
    border-top: 0;
  }
  .probe {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(10, 12, 16, 0.48);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 20;
  }
  .dialog {
    width: 560px;
    max-width: 100%;
    max-height: calc(100vh - 32px);
    overflow: auto;
    background: var(--ts-panel);
    color: var(--ts-ink);
    border-radius: 22px;
    border: 1px solid var(--ts-line);
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  }
  .dhead {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .dfoot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
  .opts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .opt {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border: 1px solid var(--ts-line);
    border-radius: 16px;
    cursor: pointer;
    background: var(--ts-panel);
    text-align: left;
  }
  .opt.on {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
  }
  .opt svg {
    color: var(--ts-sel);
    margin-bottom: 4px;
  }
  .ot {
    font-weight: 700;
    font-size: 14px;
  }
  .images {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .image {
    border: 1px solid var(--ts-line);
    border-radius: 14px;
    padding: 6px;
    background: var(--ts-panel2);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    text-align: left;
    min-width: 0;
  }
  .image.on {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
  }
  .image img {
    width: 100%;
    height: 64px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }
  .image span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background: var(--ts-ink);
    color: var(--ts-panel);
    padding: 12px 18px;
    border-radius: 14px;
    font-weight: 600;
    z-index: 30;
    max-width: calc(100% - 32px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    font-size: 13.5px;
  }

  @container (max-width: 1179px) {
    .editor {
      grid-template-columns: 360px minmax(0, 1fr);
    }
    .rail {
      display: none;
    }
    .chips {
      display: flex;
    }
    .hide-t {
      display: none;
    }
  }
  @container (max-width: 719px) {
    .editor {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
    }
    .editor .pv {
      order: -1;
    }
    .editor .stage {
      height: 40vh;
    }
    .ctl {
      border-right: 0;
    }
    .sec {
      padding: 16px 16px 48px;
    }
    .name {
      font-size: 16px;
    }
    .scrim {
      align-items: flex-end;
      padding: 0;
    }
    .dialog {
      border-radius: 22px 22px 0 0;
      width: 100%;
      max-height: 88vh;
    }
    .opts {
      grid-template-columns: minmax(0, 1fr);
    }
    .images {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .toast {
      bottom: 16px;
    }
  }
`;var st={palette:"M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M15 7.8h.01",back:"m15 18-6-6 6-6",refresh:"M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",sun:"M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",split:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM12 4v16",phone:"M9.5 2.5h5A2.5 2.5 0 0 1 17 5v14a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 19V5a2.5 2.5 0 0 1 2.5-2.5zM11 18h2",tablet:"M6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3zM11 18h2",desktop:"M4.5 4h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 21h8M12 17v4",bulb:"M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",thermo:"M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",home:"M3 11 12 4l9 7M5 10v10h14V10",image:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-9 9",lock:"M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3",edit:"M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",contrast:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18M12 7h4.5M12 11h6M12 15h5.5",plus:"M12 5v14M5 12h14",grid:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",trash:"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",undo:"M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",redo:"m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",upload:"M12 15V4M7 9l5-5 5 5M5 20h14",swap:"M7 7h11l-3-3M17 17H6l3 3",check:"m5 12 5 5 9-10",close:"M6 6l12 12M18 6 6 18",chevron:"m6 9 6 6 6-6",wand:"m4 20 11-11M14 3l1 2.2 2.2 1-2.2 1L14 9.4l-1-2.2-2.2-1 2.2-1z"};function h(a,t=20){return l`<svg
    width=${t}
    height=${t}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${ne`<path d=${st[a]}></path>`}
  </svg>`}function He(a=16){return l`<svg width=${a} height=${a} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    ${ne`<path d="M8 5v14l11-7z"></path>`}
  </svg>`}function Ue(){return l`
    <div class="mock">
      <div class="m-scroll">
        <div class="m-head">
          <div class="m-headtext">
            <div class="m-title">Home</div>
            <div class="m-sub">Wednesday · 14° outside</div>
          </div>
          <div class="m-avatar">C</div>
        </div>
        <div class="m-chips">
          <span class="m-chip on">Living room</span>
          <span class="m-chip">Kitchen</span>
          <span class="m-chip">Bedroom</span>
          <span class="m-chip">Garden</span>
        </div>
        <div class="m-grid">
          <div class="m-col">
            <div class="m-tiles">
              <div class="m-card">
                <div class="m-ic on">${h("bulb",19)}</div>
                <div class="m-name">Ceiling</div>
                <div class="m-state">On · 70 %</div>
              </div>
              <div class="m-card">
                <div class="m-ic">${h("bulb",19)}</div>
                <div class="m-name">Floor lamp</div>
                <div class="m-state">Off</div>
              </div>
            </div>
            <div class="m-bubble">
              <div class="m-fill"></div>
              <div class="m-bic">${h("sun",18)}</div>
              <div class="m-btext">
                <div class="m-name">Dining table</div>
                <div class="m-state">60 %</div>
              </div>
            </div>
          </div>
          <div class="m-col">
            <div class="m-card">
              <div class="m-row">
                <div class="m-ic on">${h("thermo",19)}</div>
                <div class="m-state">Living room</div>
              </div>
              <div class="m-temp">21.5°</div>
              <div class="m-state">Heating to 22°</div>
              <div class="m-track"><div class="m-tfill"></div></div>
            </div>
            <div class="m-card m-media">
              <div class="m-art"></div>
              <div class="m-btext">
                <div class="m-name">Evening playlist</div>
                <div class="m-state">Kitchen speaker</div>
              </div>
              <div class="m-play">${He()}</div>
            </div>
          </div>
          <div class="m-col m-col3">
            <div class="m-pop">
              <div class="m-name">Front door</div>
              <div class="m-state">Locked · 2 min ago</div>
              <div class="m-track"><div class="m-tfill"></div></div>
            </div>
            <div class="m-card">
              <div class="m-ic">${h("home",19)}</div>
              <div class="m-name">Away mode</div>
              <div class="m-state">Off</div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-nav">
        <span class="on">${h("home",21)}</span>
        <span>${h("bulb",21)}</span>
        <span>${h("thermo",21)}</span>
        <span>${h("image",21)}</span>
      </div>
    </div>
  `}var Ve=w`
  .mock {
    position: absolute;
    inset: 0;
    overflow: hidden;
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    font-family: var(--primary-font-family, system-ui), system-ui, sans-serif;
    color: var(--primary-text-color);
    background: var(--lovelace-background, var(--primary-background-color));
    background-attachment: scroll;
  }
  .m-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 20px 14px 96px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .m-scroll > * {
    flex: none;
  }
  .m-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .m-headtext {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .m-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--primary-text-color);
  }
  .m-sub,
  .m-state {
    font-size: 12.5px;
    color: var(--secondary-text-color);
  }
  .m-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 14px;
    flex: none;
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-chips {
    display: flex;
    gap: 8px;
    overflow: hidden;
  }
  .m-chip {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    flex: none;
    background: var(--bubble-main-background-color, var(--ha-card-background));
    color: var(--primary-text-color);
  }
  .m-chip.on {
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .m-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }
  .m-col3 {
    display: none;
  }
  .m-tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .m-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    background: var(--ha-card-background, var(--card-background-color));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, transparent);
    backdrop-filter: var(--theme-studio-card-backdrop-filter, none);
    -webkit-backdrop-filter: var(--theme-studio-card-backdrop-filter, none);
    color: var(--primary-text-color);
  }
  .m-name {
    font-weight: 600;
    font-size: 14px;
  }
  .m-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .m-ic {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    margin-bottom: 6px;
    flex: none;
    color: var(--state-icon-color);
    background: color-mix(in srgb, var(--state-icon-color) 12%, transparent);
  }
  .m-row .m-ic {
    margin-bottom: 0;
  }
  .m-ic.on {
    color: var(--state-icon-active-color);
    background: color-mix(in srgb, var(--state-icon-active-color) 16%, transparent);
  }
  .m-bubble {
    position: relative;
    height: 58px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    overflow: hidden;
    background: var(--bubble-main-background-color, var(--ha-card-background));
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, none);
    border: var(--bubble-border, none);
    color: var(--primary-text-color);
  }
  .m-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 62%;
    background: var(--bubble-accent-color, var(--accent-color));
  }
  .m-bic,
  .m-btext {
    position: relative;
  }
  .m-btext {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .m-bic {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-temp {
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-top: 6px;
  }
  .m-track {
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 8px;
    background: var(--divider-color);
  }
  .m-tfill {
    height: 100%;
    width: 72%;
    border-radius: 4px;
    background: var(--accent-color);
  }
  .m-media {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .m-art {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    flex: none;
    background: linear-gradient(
      135deg,
      var(--accent-color),
      color-mix(in srgb, var(--accent-color) 45%, var(--primary-background-color))
    );
  }
  .m-play {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
    margin-left: auto;
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-pop {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: var(--bubble-pop-up-background-color, var(--ha-card-background));
    border: var(--bubble-pop-up-border, none);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
  .m-nav {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    height: 58px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: var(--theme-studio-navbar-background-color, var(--ha-card-background));
    color: var(--theme-studio-navbar-primary-color, var(--primary-text-color));
    box-shadow: var(--ha-card-box-shadow, none);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .m-nav span {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
  }
  .m-nav .on {
    color: var(--accent-color);
  }
  @container (min-width: 520px) {
    .m-grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .m-scroll {
      padding: 24px 22px 100px;
    }
    .m-nav {
      left: 50%;
      right: auto;
      width: 360px;
      transform: translateX(-50%);
    }
  }
  @container (min-width: 760px) {
    .m-grid {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr);
    }
    .m-col3 {
      display: flex;
    }
  }
`;var Ie=w`
  :host {
    --ts-bg: #eceef2;
    --ts-panel: #ffffff;
    --ts-panel2: #f5f6f8;
    --ts-ink: #15171c;
    --ts-muted: #555c6a;
    --ts-line: #dcdfe6;
    --ts-sel: #2a55d8;
    --ts-sel-soft: rgba(42, 85, 216, 0.1);
    --ts-ok: #1b6e44;
    --ts-ok-soft: #e2f2e9;
    --ts-warn: #9c3f12;
    --ts-warn-soft: #fbe9df;
    --ts-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --ts-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    display: block;
    height: 100%;
    background: var(--ts-bg);
    color: var(--ts-ink);
    font-family: var(--ts-font);
    font-size: 14px;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }
  :host([dark]) {
    --ts-bg: #0d0f12;
    --ts-panel: #16191e;
    --ts-panel2: #1d2127;
    --ts-ink: #eceef2;
    --ts-muted: #a1a8b5;
    --ts-line: #2a2f37;
    --ts-sel: #86a4ff;
    --ts-sel-soft: rgba(134, 164, 255, 0.14);
    --ts-ok: #6ad49c;
    --ts-ok-soft: rgba(106, 212, 156, 0.12);
    --ts-warn: #ffa477;
    --ts-warn-soft: rgba(255, 164, 119, 0.13);
  }
  * {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
  }
  h1,
  h2,
  p {
    margin: 0;
  }
  .shell {
    container-type: inline-size;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    min-height: 64px;
    background: var(--ts-panel);
    border-bottom: 1px solid var(--ts-line);
    flex: none;
  }
  ha-menu-button {
    color: var(--ts-ink);
    --mdc-icon-button-size: 44px;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--ts-ink);
    color: var(--ts-panel);
    flex: none;
  }
  .titlebox {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status {
    font-size: 12.5px;
    color: var(--ts-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    flex: none;
  }
  .btn:hover {
    background: var(--ts-panel2);
  }
  .btn.icon {
    width: 44px;
    padding: 0;
  }
  .btn.on {
    background: var(--ts-sel-soft);
    color: var(--ts-sel);
    border-color: transparent;
  }
  .btn.sm {
    min-height: 36px;
    padding: 0 12px;
    font-size: 13px;
    border-radius: 10px;
  }
  .btn:focus-visible,
  .seg button:focus-visible,
  .tcard:focus-visible {
    outline: 2px solid var(--ts-sel);
    outline-offset: 2px;
  }
  .seg {
    display: inline-flex;
    padding: 3px;
    border-radius: 13px;
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    gap: 2px;
    flex: none;
  }
  .seg button {
    border: 0;
    background: transparent;
    min-height: 36px;
    min-width: 40px;
    padding: 0 12px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    color: var(--ts-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .seg button.on {
    background: var(--ts-panel);
    color: var(--ts-ink);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--ts-line);
  }

  /* Library */
  .lib {
    flex: 1;
    overflow: auto;
    padding: 28px 32px 56px;
  }
  .lib-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin: 0 auto 18px;
    max-width: 1240px;
  }
  .lib-title {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.015em;
  }
  .sub {
    color: var(--ts-muted);
    margin-top: 4px;
    max-width: 560px;
  }
  .notice {
    max-width: 1240px;
    margin: 0 auto;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--ts-sel-soft);
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .notice > svg {
    color: var(--ts-sel);
    flex: none;
  }
  .notice-text {
    flex: 1;
    min-width: 220px;
  }
  .gtitle {
    max-width: 1240px;
    margin: 26px auto 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ts-muted);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 18px;
    max-width: 1240px;
    margin: 0 auto;
  }
  .tcard {
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    border-radius: 18px;
    padding: 10px;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.15s, transform 0.15s;
  }
  .tcard:hover {
    border-color: var(--ts-muted);
    transform: translateY(-1px);
  }
  .mini {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 12px;
    overflow: hidden;
    height: 150px;
  }
  .mini-v {
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    position: relative;
  }
  .mini-v.empty {
    background: var(--ts-panel2);
    align-items: center;
    justify-content: center;
    color: var(--ts-muted);
  }
  .mini-line {
    height: 7px;
    border-radius: 4px;
    width: 55%;
  }
  .mini-card {
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .mini-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex: none;
  }
  .mini-bar {
    height: 5px;
    border-radius: 3px;
    flex: 1;
  }
  .mini-nav {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 9px;
    height: 14px;
    border-radius: 7px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  .tmeta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 2px 4px;
  }
  .tmeta-text {
    min-width: 0;
  }
  .tname {
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tsub {
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .badge {
    font-family: var(--ts-mono);
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    background: var(--ts-ok-soft);
    color: var(--ts-ok);
    white-space: nowrap;
  }
  .badge.warn {
    background: var(--ts-warn-soft);
    color: var(--ts-warn);
  }
  .message {
    max-width: 640px;
    margin: 48px auto;
    padding: 20px;
    border-radius: 16px;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  /* Theme view */
  .ed {
    flex: 1;
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    min-height: 0;
  }
  .info {
    background: var(--ts-panel);
    border-right: 1px solid var(--ts-line);
    overflow: auto;
    min-height: 0;
    padding: 20px 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .h {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ts-muted);
    margin-bottom: 10px;
  }
  .hint {
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ts-line);
    border-radius: 16px;
    overflow: hidden;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px;
    border-top: 1px solid var(--ts-line);
  }
  .row:first-child {
    border-top: 0;
  }
  .sw {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--ts-line);
    flex: none;
  }
  .row-text {
    flex: 1;
    min-width: 0;
  }
  .rn {
    font-weight: 600;
    font-size: 14px;
  }
  .val {
    font-family: var(--ts-mono);
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .sumrow {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .sumpill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    font-weight: 600;
    font-size: 13px;
  }
  .soon {
    padding: 14px;
    border-radius: 16px;
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .pv {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
  }
  .pv-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--ts-line);
    background: var(--ts-panel);
    flex: none;
  }
  .grow {
    flex: 1;
  }
  .stage {
    flex: 1;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 28px;
    padding: 28px;
    min-height: 0;
    background-color: var(--ts-bg);
    background-image: radial-gradient(var(--ts-line) 1px, transparent 1px);
    background-size: 18px 18px;
  }
  .fwrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    flex: none;
    max-width: 100%;
  }
  .flabel {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ts-muted);
  }
  .frame {
    position: relative;
    overflow: hidden;
    flex: none;
    background: var(--primary-background-color);
  }
  .frame.phone {
    width: 340px;
    height: 680px;
    border: 8px solid #0e0f12;
    border-radius: 42px;
  }
  .frame.tablet {
    width: 600px;
    height: 720px;
    border: 10px solid #0e0f12;
    border-radius: 30px;
  }
  .frame.desktop {
    width: 880px;
    max-width: 100%;
    height: 580px;
    border: 1px solid var(--ts-line);
    border-radius: 14px;
  }
  .loading {
    padding: 40px;
    color: var(--ts-muted);
    text-align: center;
  }

  @container (max-width: 1099px) {
    .ed {
      grid-template-columns: 330px minmax(0, 1fr);
    }
    .frame.desktop,
    .frame.tablet {
      width: 100%;
    }
  }
  @container (max-width: 719px) {
    .bar {
      padding: 6px 10px;
      gap: 8px;
      min-height: 60px;
    }
    .hide-p {
      display: none;
    }
    .lib {
      padding: 18px 14px 40px;
    }
    .lib-title {
      font-size: 24px;
    }
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .mini {
      height: 112px;
    }
    .mini-v {
      padding: 9px 7px;
      gap: 5px;
    }
    .tcard {
      padding: 7px;
      border-radius: 15px;
    }
    .tname {
      font-size: 14px;
    }
    .tmeta {
      flex-direction: column;
      align-items: flex-start;
    }
    .ed {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
    }
    .pv {
      order: -1;
      border-bottom: 1px solid var(--ts-line);
    }
    .pv-bar {
      padding: 6px 10px;
    }
    .stage {
      flex: none;
      height: 46vh;
      padding: 12px;
      gap: 10px;
      background-image: none;
    }
    .fwrap {
      flex: 1 1 0;
      min-width: 0;
      height: 100%;
    }
    .flabel {
      display: none;
    }
    .frame.phone,
    .frame.tablet,
    .frame.desktop {
      width: 100%;
      max-width: 440px;
      height: 100%;
      border: 1px solid var(--ts-line);
      border-radius: 20px;
    }
    .info {
      border-right: 0;
      padding: 16px 16px 40px;
    }
  }
`;var rt=/^\/theme\/([^/]+)/,at=/^[a-z0-9-]+$/,nt=/[;{}<>]/,ot=/^#?([0-9a-f]{6})$/i,he=["light","dark"],lt=900,dt=90,ct=800,pt=60;function _(a){if(a&&typeof a=="object"){let t=a;if(t.code==="name_taken")return"That name is already used by another theme.";if(t.code==="unauthorized")return"Only administrators can change themes.";if("message"in t)return String(t.message)}return String(a)}function Oe(a){let t={};for(let[e,i]of Object.entries(a))at.test(e)&&!nt.test(i)&&(t[`--${e}`]=i);return t}function ht(a){if(!a.image||!a.image.startsWith("/"))return a.page;let t=encodeURI(a.image).replace(/'/g,"%27");return`linear-gradient(${a.page}cc, ${a.page}cc), url('${t}') center / cover`}function Be(a){let t=a.filter(e=>!e.ok).length;return t===0?`all ${a.length} readable`:`${t} of ${a.length} to check`}function ut(a){let t=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i.exec(a),e;if(t)e=[t[1],t[2],t[3]].map(Number);else{let i=/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i.exec(a);i&&(e=[i[1],i[2],i[3]].map(s=>Number(s)*255))}return e?`#${e.map(i=>Math.round(Math.min(255,Math.max(0,i))).toString(16).padStart(2,"0")).join("")}`.toUpperCase():""}function T(a){let t=ot.exec(a.trim());return t?`#${t[1].toUpperCase()}`:void 0}function K(a){return{light:{...a.light},dark:{...a.dark}}}var U=class extends ${constructor(){super();this._schema=new Map;this._schemaLoading=!1;this._dirty=new Set;this._nameDirty=!1;this._saving=!1;this._saveAgain=!1;this._previewTimers={};this._previewSeq={light:0,dark:0};this._lastTime=0;this._libraryStale=!1;this._closeDialog=()=>{this._busy||(this._dialog=void 0)};this.narrow=!1,this._loading=!1,this._filter="all",this._variant="light",this._both=!1,this._device="phone",this._previews={},this._probe={},this._section="colours",this._open=new Set,this._saveState="saved",this._history=[],this._future=[],this._busy=!1,this._newMode="preset",this._newSource="default",this._newColour="#3A6EA5",this._newName=""}disconnectedCallback(){super.disconnectedCallback(),this._flush()}get _slug(){let e=rt.exec(this.route?.path??"");return e?decodeURIComponent(e[1]):void 0}get _canEdit(){return this.hass?.user?.is_admin!==!1}willUpdate(e){e.has("hass")&&this.hass&&(this.toggleAttribute("dark",!!this.hass.themes?.darkMode),!this._themes&&!this._loading&&!this._error&&this._loadThemes(),!this._schema.size&&!this._schemaLoading&&this._loadSchema());let i=this._slug;this.hass&&i&&i!==this._detailSlug&&this._loadDetail(i),!i&&this._libraryStale&&e.has("route")&&(this._libraryStale=!1,this._loadThemes())}updated(e){e.has("_previews")&&this._resolveProbe()}async _loadThemes(){if(this.hass){this._loading=!0,this._error=void 0;try{let e=await this.hass.callWS({type:"theme_studio/themes"});this._themes=e.themes}catch(e){this._error=_(e)}finally{this._loading=!1}}}async _loadSchema(){if(this.hass){this._schemaLoading=!0;try{let e=await this.hass.callWS({type:"theme_studio/schema"});this._schema=new Map(e.settings.map(i=>[i.key,i])),this.requestUpdate()}catch(e){this._error=_(e)}finally{this._schemaLoading=!1}}}async _loadDetail(e){if(this.hass){await this._flush(),this._detailSlug=e,this._edit=void 0,this._previews={},this._probe={},this._detailError=void 0,this._history=[],this._future=[],this._hexDraft=void 0,this._saveState="saved",this._saveError=void 0;try{let i=await this.hass.callWS({type:"theme_studio/theme",slug:e});if(this._detailSlug!==e)return;if(!i.light||!i.dark){this._detailError="This theme could not be built.";return}this._edit={slug:i.slug,name:i.name,builtin:i.builtin,settings:{light:{...i.light.settings},dark:{...i.dark.settings}}},this._previews={light:i.light,dark:i.dark}}catch(i){this._detailSlug===e&&(this._detailError=_(i))}}}async _loadBackgrounds(){if(!(!this.hass||this._backgrounds))try{let e=await this.hass.callWS({type:"theme_studio/backgrounds"});this._backgrounds=e.images,this._newImage=this._newImage??e.images[0]?.file}catch{this._backgrounds=[]}}_navigate(e,i=!1){i?window.history.replaceState(null,"",e):window.history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:i}}))}_prefix(){return this.route?.prefix??"/theme-studio-panel"}_openTheme(e){this._navigate(`${this._prefix()}/theme/${encodeURIComponent(e)}`)}async _back(){await this._flush(),this._detailSlug=void 0,this._edit=void 0,this._navigate(this._prefix())}_refresh(){this._themes=void 0,this._error=void 0,this._loadThemes()}_showToast(e){this._toast=e,window.clearTimeout(this._toastTimer),this._toastTimer=window.setTimeout(()=>{this._toast=void 0},3600)}_snapshot(){return this._edit?{name:this._edit.name,settings:K(this._edit.settings)}:void 0}_pushHistory(e){let i=Date.now(),s=e!==void 0&&e===this._lastKey&&i-this._lastTime<ct;if(this._lastKey=e,this._lastTime=i,s)return;let r=this._snapshot();r&&(this._history=[...this._history,r].slice(-pt),this._future=[])}_change(e,i,s){if(!this._edit||!this._canEdit)return;this._pushHistory(s);let r=K(this._edit.settings);for(let n of e)r[n]={...r[n],...i},this._dirty.add(n),this._schedulePreview(n);this._edit={...this._edit,settings:r},this._scheduleSave()}_replaceVariant(e,i){if(!this._edit||!this._canEdit)return;this._pushHistory();let s=K(this._edit.settings);s[e]={...s[e],...i},this._dirty.add(e),this._edit={...this._edit,settings:s},this._schedulePreview(e),this._scheduleSave()}_rename(e){!this._edit||!this._canEdit||(this._pushHistory("name"),this._edit={...this._edit,name:e},this._nameDirty=!0,e.trim()&&this._scheduleSave())}_restore(e){let i=this[e],s=this._snapshot();if(!i.length||!this._edit||!s)return;let r=i[i.length-1];e==="_history"?(this._history=i.slice(0,-1),this._future=[...this._future,s]):(this._future=i.slice(0,-1),this._history=[...this._history,s]),this._lastKey=void 0,this._hexDraft=void 0,this._edit={...this._edit,name:r.name,settings:K(r.settings)},this._nameDirty=this._nameDirty||r.name!==s.name;for(let n of he)this._dirty.add(n),this._schedulePreview(n);this._scheduleSave()}_schedulePreview(e){window.clearTimeout(this._previewTimers[e]),this._previewTimers[e]=window.setTimeout(()=>void this._runPreview(e),dt)}async _runPreview(e){if(!this.hass||!this._edit)return;let i=++this._previewSeq[e];try{let s=await this.hass.callWS({type:"theme_studio/preview",settings:this._edit.settings[e]});i===this._previewSeq[e]&&(this._previews={...this._previews,[e]:s})}catch(s){this._showToast(`Preview failed: ${_(s)}`)}}_scheduleSave(e=lt){this._saveState="unsaved",window.clearTimeout(this._saveTimer),this._saveTimer=window.setTimeout(()=>void this._save(),e)}async _flush(){window.clearTimeout(this._saveTimer),(this._dirty.size||this._nameDirty)&&await this._save()}async _save(){if(!this.hass||!this._edit||!this._canEdit)return;if(this._saving){this._saveAgain=!0;return}if(!this._dirty.size&&!this._nameDirty){this._saveState="saved";return}this._saving=!0,this._saveState="saving";let e=new Set(this._dirty),i=this._nameDirty;this._dirty.clear(),this._nameDirty=!1;try{this._edit.builtin&&(await this._fork(),he.forEach(n=>e.add(n)));let s=this._edit,r={type:"theme_studio/theme/save",slug:s.slug};i&&s.name.trim()&&(r.name=s.name.trim());for(let n of e)r[n]=s.settings[n];await this.hass.callWS(r),this._libraryStale=!0,this._saveError=void 0,this._saveState=this._dirty.size||this._nameDirty?"unsaved":"saved"}catch(s){e.forEach(r=>this._dirty.add(r)),this._nameDirty=this._nameDirty||i,this._saveState="error",this._saveError=_(s)}finally{this._saving=!1,this._saveAgain&&(this._saveAgain=!1,this._scheduleSave(200))}}async _fork(){if(!this.hass||!this._edit)return;let e=this._edit.name!==this._presetName()?this._edit.name:`${this._edit.name} (copy)`,i=await this.hass.callWS({type:"theme_studio/theme/new",source:this._edit.slug,name:e.trim()||`${this._presetName()} (copy)`});this._edit={...this._edit,slug:i.slug,name:i.name,builtin:!1},this._detailSlug=i.slug,this._navigate(`${this._prefix()}/theme/${encodeURIComponent(i.slug)}`,!0),this._showToast(`Built-in presets stay as they are. Your changes are saved in \u201C${i.name}\u201D.`)}_presetName(){return this._themes?.find(i=>i.slug===this._edit?.slug)?.name??this._edit?.name??""}async _build(){if(!(!this.hass||!this._edit)){this._busy=!0;try{await this._flush();let e=await this.hass.callWS({type:"theme_studio/theme/build",slug:this._edit.slug});this._showToast(`\u201C${e.name}\u201D is updated in Home Assistant. Pick it in your profile to use it.`)}catch(e){this._showToast(`Could not update the theme: ${_(e)}`)}finally{this._busy=!1}}}async _delete(){if(!this.hass||!this._edit)return;this._busy=!0;let{slug:e,name:i}=this._edit;try{window.clearTimeout(this._saveTimer),this._dirty.clear(),this._nameDirty=!1,await this.hass.callWS({type:"theme_studio/theme/delete",slug:e}),this._dialog=void 0,this._libraryStale=!0,this._detailSlug=void 0,this._edit=void 0,this._navigate(this._prefix()),this._showToast(`\u201C${i}\u201D is deleted. A backup copy stays in the user_themes folder.`)}catch(s){this._showToast(`Could not delete: ${_(s)}`)}finally{this._busy=!1}}async _mirror(){if(!this.hass||!this._edit)return;let e=this._variant,i=e==="light"?"dark":"light";try{let s=await this.hass.callWS({type:"theme_studio/mirror",settings:this._edit.settings[e],target:i});this._replaceVariant(i,s.settings),this._showToast(`${i==="dark"?"Dark":"Light"} is now a copy of ${e==="light"?"Light":"Dark"}. Undo brings the old one back.`)}catch(s){this._showToast(`Could not copy: ${_(s)}`)}}async _createNew(){if(!this.hass)return;let e={type:"theme_studio/theme/new"};if(this._newName.trim()&&(e.name=this._newName.trim()),this._newMode==="image"){if(!this._newImage)return;e.image=this._newImage}else e.source=this._newMode==="colour"?"default":this._newSource,this._newMode==="colour"&&(e.base_color=this._newColour);this._busy=!0;try{let i=await this.hass.callWS(e);this._dialog=void 0,this._newName="",this._libraryStale=!0,this._themes=void 0,this._loadThemes(),this._openTheme(i.slug),this._showToast(`\u201C${i.name}\u201D is created with a light and a dark variant.`)}catch(i){this._showToast(`Could not create the theme: ${_(i)}`)}finally{this._busy=!1}}_resolveProbe(){let e=this.renderRoot.querySelector(".probe"),i=e?.querySelector("span");if(!e||!i)return;let s={};for(let r of he){let n=this._previews[r];if(!n)continue;e.removeAttribute("style");for(let[o,p]of Object.entries(Oe(n.variables)))e.style.setProperty(o,p);let d={};for(let o of le)o.cssVar&&(i.style.color=`var(--${o.cssVar})`,d[o.id]=ut(getComputedStyle(i).color));s[r]=d}this._probe=s}_roleColour(e,i){let s=this._edit?.settings[i];if(s&&q(e,s))return T(de(e,s))??de(e,s);let r=this._previews[i];return e.summary&&r?String(r.summary[e.summary]).toUpperCase():this._probe[i]?.[e.id]??""}render(){return l`
      ${this._slug?this._renderEditor(this._slug):this._renderLibrary()}
      ${this._dialog==="new"?this._renderNewDialog():c}
      ${this._dialog==="delete"?this._renderDeleteDialog():c}
      ${this._toast?l`<div class="toast" role="status">${this._toast}</div>`:c}
    `}_renderLibrary(){let e=this._themes??[],i=e.filter(r=>this._filter==="all"?!0:this._filter==="mine"?!r.builtin:r.builtin),s=[{title:"Mine",items:i.filter(r=>!r.builtin)},{title:"Built-in presets",items:i.filter(r=>r.builtin)}].filter(r=>r.items.length>0);return l`
      <div class="shell">
        <header class="bar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="logo">${h("palette",22)}</div>
          <div class="titlebox">
            <div class="title">Theme Studio</div>
            <div class="status">${e.length?`${e.length} themes \xB7 light and dark`:"Themes for Home Assistant"}</div>
          </div>
          <button class="btn icon" @click=${this._refresh} aria-label="Reload themes" title="Reload themes">
            ${h("refresh")}
          </button>
          ${this._canEdit?l`<button
                class="btn primary"
                aria-label="New theme"
                @click=${()=>{this._dialog="new",this._loadBackgrounds()}}
              >
                ${h("plus",18)}<span class="hide-p">New theme</span>
              </button>`:c}
        </header>
        <main class="lib">
          <div class="lib-head">
            <div>
              <h1 class="lib-title">Your themes</h1>
              <p class="sub">
                Open a theme to change it. Built-in presets are copied the first time you change them, so they always
                stay as they are.
              </p>
            </div>
            <div class="seg" role="group" aria-label="Show">
              ${this._filterButton("all","All")} ${this._filterButton("mine","Mine")}
              ${this._filterButton("builtin","Built-in")}
            </div>
          </div>
          ${this._error?l`<div class="message">
                <strong>Could not load the themes</strong>
                <span class="hint">${this._error}</span>
                <button class="btn sm" @click=${this._refresh}>Try again</button>
              </div>`:c}
          ${this._loading&&!this._themes?l`<div class="loading">Loading themes…</div>`:c}
          ${s.map(r=>l`
              <div class="gtitle">${r.title} · ${r.items.length}</div>
              <div class="grid">${r.items.map(n=>this._renderCard(n))}</div>
            `)}
        </main>
      </div>
    `}_filterButton(e,i){return l`<button
      class=${this._filter===e?"on":""}
      aria-pressed=${this._filter===e?"true":"false"}
      @click=${()=>{this._filter=e}}
    >
      ${i}
    </button>`}_renderCard(e){let i=(e.light?.failing??0)+(e.dark?.failing??0);return l`
      <button class="tcard" @click=${()=>this._openTheme(e.slug)} aria-label=${`Open ${e.name}`}>
        <div class="mini">${this._renderMini(e.light)}${this._renderMini(e.dark)}</div>
        <div class="tmeta">
          <div class="tmeta-text">
            <div class="tname">${e.name}</div>
            <div class="tsub">${e.builtin?"Built-in preset":"Mine"}</div>
          </div>
          ${i?l`<span class="badge warn">${i} to check</span>`:c}
        </div>
      </button>
    `}_renderMini(e){if(!e)return l`<div class="mini-v empty">–</div>`;let i=e.summary,s=`${Math.min(i.radius,14)*.5}px`;return l`
      <div class="mini-v" style=${g({background:ht(i)})}>
        <div class="mini-line" style=${g({background:i.text})}></div>
        <div class="mini-card" style=${g({background:i.card,borderRadius:s})}>
          <span class="mini-dot" style=${g({background:i.accent})}></span>
          <span class="mini-bar" style=${g({background:i.text})}></span>
        </div>
        <div class="mini-card" style=${g({background:i.card,borderRadius:s})}>
          <span class="mini-dot" style=${g({background:i.icon})}></span>
          <span class="mini-bar" style=${g({background:i.secondary})}></span>
        </div>
        <div class="mini-nav" style=${g({background:i.navbar})}></div>
      </div>
    `}_statusText(){if(!this._canEdit)return"View only \xB7 ask an administrator to change themes";if(!this._edit)return"Loading\u2026";if(this._edit.builtin&&this._saveState==="saved")return"Built-in preset \xB7 your first change makes a copy";switch(this._saveState){case"saving":return"Saving\u2026";case"unsaved":return"Unsaved changes";case"error":return`Not saved: ${this._saveError??"unknown error"}`;default:return"All changes saved"}}_failing(e){return this._previews[e]?.contrast.filter(i=>!i.ok).length??0}_renderEditor(e){let i=this._edit?.slug===e||this._detailSlug===e?this._edit:void 0,s=this._themes?.find(o=>o.slug===e),r=i?.name??s?.name??e,n=this._failing(this._variant),d=H.find(o=>o.id===this._section)??H[0];return l`
      <div class="shell">
        <header class="bar">
          <button class="btn icon" @click=${()=>void this._back()} aria-label="Back to all themes">${h("back")}</button>
          <div class="titlebox">
            <input
              class="name"
              .value=${r}
              ?disabled=${!i||!this._canEdit}
              aria-label="Theme name"
              spellcheck="false"
              maxlength="60"
              @input=${o=>this._rename(o.target.value)}
            />
            <div class="status ${this._saveState==="error"?"error":""}">${this._statusText()}</div>
          </div>
          <button class="btn icon" aria-label="Undo" title="Undo" ?disabled=${!this._history.length} @click=${()=>this._restore("_history")}>
            ${h("undo",19)}
          </button>
          <button class="btn icon hide-p" aria-label="Redo" title="Redo" ?disabled=${!this._future.length} @click=${()=>this._restore("_future")}>
            ${h("redo",19)}
          </button>
          <div class="seg" role="group" aria-label="Variant to edit">
            ${this._variantButton("light","Light")} ${this._variantButton("dark","Dark")}
          </div>
          ${i&&!i.builtin&&this._canEdit?l`
                <button class="btn icon hide-p" aria-label="Delete theme" title="Delete theme" @click=${()=>this._dialog="delete"}>
                  ${h("trash",19)}
                </button>
                <button class="btn primary" ?disabled=${this._busy} @click=${()=>void this._build()} title="Write the theme file so Home Assistant uses your changes">
                  ${h("upload",18)}<span class="hide-t">Update in HA</span>
                </button>
              `:c}
        </header>
        ${this._detailError?l`<div class="message">
              <strong>Could not load ${r}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${()=>void this._back()}>Back to all themes</button>
            </div>`:l`<div class="editor">
              <nav class="rail" aria-label="Sections">
                ${H.map(o=>l`<button class="rail-btn ${o.id===d.id?"on":""}" @click=${()=>this._section=o.id}>
                    ${h(o.icon,22)}${o.label}
                    ${o.id==="check"&&n?l`<span class="count">${n}</span>`:c}
                  </button>`)}
              </nav>
              <section class="ctl" aria-label="Controls">
                <div class="chips" role="group" aria-label="Sections">
                  ${H.map(o=>l`<button class="chip ${o.id===d.id?"on":""}" @click=${()=>this._section=o.id}>
                      ${o.label}
                      ${o.id==="check"&&n?l`<span class="count">${n}</span>`:c}
                    </button>`)}
                </div>
                ${i?.builtin&&this._canEdit?l`<div class="banner">
                      ${h("lock",18)}
                      <span>This is a built-in preset. Change anything and Theme Studio makes your own copy; the preset itself stays untouched.</span>
                    </div>`:c}
                ${i&&this._schema.size?l`<div class="sec">
                      <div>
                        <h2 class="sh">${d.label}</h2>
                        <p class="sp">${d.description}</p>
                      </div>
                      ${d.id==="check"?this._renderCheck():d.groups.map(o=>this._renderGroup(o))}
                    </div>`:l`<div class="loading">Loading…</div>`}
              </section>
              ${this._renderPreview()}
              <div class="probe" aria-hidden="true"><span></span></div>
            </div>`}
      </div>
    `}_variantButton(e,i){let s=this._variant===e;return l`<button
      class=${s?"on":""}
      aria-pressed=${s?"true":"false"}
      @click=${()=>{this._variant=e,this._hexDraft=void 0}}
    >
      ${h(e==="light"?"sun":"moon",17)}<span class="hide-p">${i}</span>
    </button>`}_renderGroup(e){let i=!e.collapsible||this._open.has(e.id),s=()=>{let r=new Set(this._open);r.has(e.id)?r.delete(e.id):r.add(e.id),this._open=r};return l`
      <div class="group">
        ${e.collapsible?l`<button class="group-head ${i?"open":""}" aria-expanded=${i?"true":"false"} @click=${s}>
              <span class="h">${e.title}</span>${h("chevron",18)}
            </button>`:l`<div class="h">${e.title}</div>`}
        ${i?e.controls.map(r=>this._renderControl(r)):c}
        ${i&&e.hint?l`<p class="hint">${e.hint}</p>`:c}
      </div>
    `}_renderControl(e){let i=this._edit?.settings[this._variant];if(!i)return c;switch(e.type){case"base":return this._renderBase(i);case"slider":return this._renderSlider(e,i);case"segmented":return this._renderSegmented(e,i);case"roles":return l`<div class="roles">${e.roles.map(s=>this._renderRole(s,i))}</div>`;case"mirror":return this._renderMirror()}}_renderBase(e){let i=T(String(e.base_color??""))??"#344334",s=r=>{let n=T(r);n&&this._change([this._variant],{base_color:n},`base_color-${this._variant}`)};return l`
      <div class="base">
        <label class="swatch-big" style=${g({background:i})}>
          <input
            type="color"
            class="cpick"
            .value=${i.toLowerCase()}
            ?disabled=${!this._canEdit}
            aria-label="Pick base colour"
            @input=${r=>{this._hexDraft=void 0,s(r.target.value)}}
          />
        </label>
        <div class="field" style="flex: 1; min-width: 0">
          <label class="lbl" for="ts-hex">Hex code</label>
          <input
            id="ts-hex"
            class="text-input"
            .value=${this._hexDraft??i}
            ?disabled=${!this._canEdit}
            spellcheck="false"
            maxlength="7"
            @input=${r=>{let n=r.target.value;this._hexDraft=n,s(n)}}
            @blur=${()=>this._hexDraft=void 0}
          />
        </div>
      </div>
    `}_renderSlider(e,i){let s=this._schema.get(e.key);if(!s)return c;let r=Number(i[e.key]??s.default??0),n=`ts-${e.key}`;return l`
      <div class="field">
        <div class="lbl"><label for=${n}>${e.label??s.label}</label><span class="val">${Math.round(r)}</span></div>
        <input
          id=${n}
          type="range"
          min=${s.min??0}
          max=${s.max??100}
          step=${s.step??1}
          .value=${String(r)}
          ?disabled=${!this._canEdit}
          @input=${d=>this._change([this._variant],{[e.key]:Number(d.target.value)},`${e.key}-${this._variant}`)}
        />
        ${e.ends?l`<div class="ends"><span>${e.ends[0]}</span><span>${e.ends[1]}</span></div>`:c}
      </div>
    `}_renderSegmented(e,i){let s=this._schema.get(e.key);if(!s)return c;let r=String(i[e.key]??s.default??"");return l`
      <div class="field">
        <div class="lbl">${e.label}</div>
        <div class="seg full" role="group" aria-label=${e.label}>
          ${e.options.filter(([n])=>s.options.includes(n)).map(([n,d])=>l`<button
                class=${r===n?"on":""}
                aria-pressed=${r===n?"true":"false"}
                ?disabled=${!this._canEdit}
                @click=${()=>this._change([this._variant],{[e.key]:n},void 0)}
              >
                ${d}
              </button>`)}
        </div>
        ${e.hint?l`<p class="hint">${e.hint}</p>`:c}
      </div>
    `}_roleContrast(e){return(this._previews[this._variant]?.contrast??[]).filter(r=>F[r.key]?.includes(e.id)).reduce((r,n)=>!r||n.ratio/n.minimum<r.ratio/r.minimum?n:r,void 0)}_renderRole(e,i){let s=q(e,i),r=this._roleColour(e,this._variant),n=this._roleContrast(e),o=(this._previews[this._variant]?.contrast??[]).filter(u=>F[u.key]?.includes(e.id)).every(u=>u.ok),p=this._variant;return l`
      <div class="role">
        <div class="rs" style=${g({background:r||"transparent"})}>
          ${s?l`<input
                  type="color"
                  class="cpick"
                  .value=${(T(r)??"#000000").toLowerCase()}
                  ?disabled=${!this._canEdit}
                  aria-label=${`Pick ${e.label.toLowerCase()} colour`}
                  @input=${u=>this._change([p],ce(e,u.target.value.toUpperCase()),`role-${e.id}-${p}`)}
                /><span class="rs-lock" aria-hidden="true">${h("lock",12)}</span>`:c}
        </div>
        <div style="min-width: 0">
          <div class="rn">${e.label}</div>
          <div class="val">${s?"Manual":"Auto"} · ${r||"\u2013"}</div>
        </div>
        ${n?l`<span class=${o?"badge":"badge warn"} title=${`Lowest contrast: ${n.label} (needs ${n.minimum}:1)`}>${n.ratio.toFixed(1)}:1</span>`:l`<span></span>`}
        <div class="mode" role="group" aria-label=${`${e.label} colour mode`}>
          <button class=${s?"":"on"} ?disabled=${!this._canEdit} @click=${()=>s&&this._change([p],pe(e))}>Auto</button>
          <button
            class=${s?"on":""}
            ?disabled=${!this._canEdit||!T(r)}
            @click=${()=>{let u=T(r);!s&&u&&this._change([p],ce(e,u))}}
          >
            Manual
          </button>
        </div>
      </div>
    `}_renderMirror(){let e=this._variant==="light"?"Light":"Dark",i=this._variant==="light"?"Dark":"Light";return l`
      <button class="btn" ?disabled=${!this._canEdit} @click=${()=>void this._mirror()}>
        ${h("swap",18)}Make ${i} from ${e}
      </button>
      <p class="hint">
        Copies ${e} to ${i} with the lightness turned around, so the copy stays readable. ${i}-specific
        colours go back to Auto. Undo brings the old ${i} back.
      </p>
    `}_renderCheck(){let e=this._edit?.settings[this._variant],i=this._previews[this._variant];if(!e||!i)return l`<div class="loading">Loading…</div>`;let s=this._previews.light,r=this._previews.dark;return l`
      <div class="sumrow">
        <span class="sumpill">Light · ${s?Be(s.contrast):"\u2013"}</span>
        <span class="sumpill">Dark · ${r?Be(r.contrast):"\u2013"}</span>
      </div>
      <div class="roles">
        ${i.contrast.map(n=>{let d=(F[n.key]??[]).map(o=>le.find(p=>p.id===o)).filter(o=>!!(o&&q(o,e)));return l`
            <div class="crow">
              <div class="row-text">
                <div class="rn">${n.label}</div>
                <div class="val">${n.ratio.toFixed(1)}:1 · needs ${n.minimum}:1</div>
                ${!n.ok&&d.length?l`<div class="hint">Manual: ${d.map(o=>o.label).join(", ")}</div>`:c}
              </div>
              ${n.ok?l`<span class="badge">Readable</span>`:d.length&&this._canEdit?l`<button
                      class="btn sm"
                      @click=${()=>{let o=Object.assign({},...d.map(p=>pe(p)));this._change([this._variant],o),this._showToast(`${d.map(p=>p.label).join(", ")} set to Auto.`)}}
                    >
                      ${h("wand",16)}Use Auto
                    </button>`:l`<span class="badge warn">Low</span>`}
            </div>
          `})}
      </div>
      <p class="hint">
        Automatic colours are always made readable. Use Auto switches the manual colours of a pair back to automatic;
        Undo brings them back.
      </p>
    `}_renderPreview(){return l`
      <section class="pv" aria-label="Preview">
        <div class="pv-bar">
          <span class="grow"></span>
          <button
            class=${this._both?"btn on":"btn"}
            aria-pressed=${this._both?"true":"false"}
            @click=${()=>{this._both=!this._both}}
          >
            ${h("split",18)}<span class="hide-p">Light + Dark</span>
          </button>
          <div class="seg hide-p" role="group" aria-label="Preview size">
            ${this._deviceButton("phone","Phone")} ${this._deviceButton("tablet","Tablet")}
            ${this._deviceButton("desktop","Computer")}
          </div>
        </div>
        <div class="stage">${this._renderFrames()}</div>
      </section>
    `}_deviceButton(e,i){let s=this._device===e&&!this._both;return l`<button
      class=${s?"on":""}
      aria-pressed=${s?"true":"false"}
      aria-label=${i}
      title=${i}
      @click=${()=>{this._device=e,this._both=!1}}
    >
      ${h(e,17)}
    </button>`}_renderFrames(){let e=this._both?["light","dark"]:[this._variant],i=this._both?"phone":this._device;return e.map(s=>{let r=this._previews[s];return l`
        <div class="fwrap">
          <div class="flabel">${s==="light"?"Light":"Dark"}</div>
          ${r?l`<div class="frame ${i}" style=${g(Oe(r.variables))}>${Ue()}</div>`:l`<div class="frame ${i}"><div class="loading">Loading…</div></div>`}
        </div>
      `})}_renderNewDialog(){let e=this._themes??[],i=e.find(d=>d.slug===this._newSource)?.name??"theme",s=this._backgrounds?.find(d=>d.file===this._newImage),r=this._newMode==="preset"?`My ${i}`:this._newMode==="image"?`From ${(s?.file??"image").replace(/\.[a-z0-9]+$/i,"")}`:"My theme",n=(d,o,p,u)=>l`<button
      class="opt ${this._newMode===d?"on":""}"
      aria-pressed=${this._newMode===d?"true":"false"}
      @click=${()=>this._newMode=d}
    >
      ${h(u,22)}<span class="ot">${o}</span><span class="hint">${p}</span>
    </button>`;return l`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="New theme" @click=${d=>d.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">New theme</h2>
              <p class="sp">You get a light and a dark variant. Everything can be changed afterwards.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${h("close",18)}</button>
          </div>
          <div class="opts">
            ${n("preset","From a theme","Copy a preset or one of your themes.","grid")}
            ${n("colour","From one colour","Pick a base colour; the rest is worked out.","palette")}
            ${n("image","From an image","Colours come from a background image.","image")}
          </div>
          ${this._newMode==="preset"?l`<div class="field">
                <label class="lbl" for="ts-source">Start from</label>
                <select
                  id="ts-source"
                  class="text-input"
                  .value=${this._newSource}
                  @change=${d=>this._newSource=d.target.value}
                >
                  ${e.map(d=>l`<option value=${d.slug} ?selected=${d.slug===this._newSource}>
                      ${d.name}${d.builtin?"":" (mine)"}
                    </option>`)}
                </select>
              </div>`:c}
          ${this._newMode==="colour"?l`<div class="base">
                <label class="swatch-big" style=${g({background:this._newColour})}>
                  <input
                    type="color"
                    class="cpick"
                    .value=${this._newColour.toLowerCase()}
                    aria-label="Pick base colour"
                    @input=${d=>this._newColour=d.target.value.toUpperCase()}
                  />
                </label>
                <div class="field">
                  <span class="lbl">Base colour</span>
                  <span class="val">${this._newColour}</span>
                </div>
              </div>`:c}
          ${this._newMode==="image"?this._backgrounds===void 0?l`<div class="loading">Loading images…</div>`:this._backgrounds.length?l`<div class="images">
                    ${this._backgrounds.map(d=>l`<button
                        class="image ${d.file===this._newImage?"on":""}"
                        aria-pressed=${d.file===this._newImage?"true":"false"}
                        @click=${()=>this._newImage=d.file}
                      >
                        <img src=${d.url} alt="" loading="lazy" /><span>${d.file}</span>
                      </button>`)}
                  </div>`:l`<p class="hint">No images in /config/www/background yet.</p>`:c}
          <div class="field">
            <label class="lbl" for="ts-newname">Name</label>
            <input
              id="ts-newname"
              class="text-input plain"
              maxlength="60"
              .value=${this._newName}
              placeholder=${r}
              @input=${d=>this._newName=d.target.value}
            />
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy||this._newMode==="image"&&!this._newImage} @click=${()=>void this._createNew()}>
              Create and open
            </button>
          </div>
        </div>
      </div>
    `}_renderDeleteDialog(){let e=this._edit?.name??"";return l`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="alertdialog" aria-modal="true" aria-label="Delete theme" @click=${i=>i.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">Delete “${e}”?</h2>
              <p class="sp">
                The theme and its theme file are removed from Home Assistant. A backup copy of the theme stays in
                /config/theme_studio/user_themes.
              </p>
            </div>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${()=>void this._delete()}>${h("trash",18)}Delete</button>
          </div>
        </div>
      </div>
    `}};U.properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1},_themes:{state:!0},_loading:{state:!0},_error:{state:!0},_filter:{state:!0},_detailError:{state:!0},_variant:{state:!0},_both:{state:!0},_device:{state:!0},_edit:{state:!0},_previews:{state:!0},_probe:{state:!0},_section:{state:!0},_open:{state:!0},_saveState:{state:!0},_saveError:{state:!0},_history:{state:!0},_future:{state:!0},_hexDraft:{state:!0},_dialog:{state:!0},_toast:{state:!0},_busy:{state:!0},_newMode:{state:!0},_newSource:{state:!0},_newColour:{state:!0},_newImage:{state:!0},_newName:{state:!0},_backgrounds:{state:!0}},U.styles=[Ie,Ve,Ne];customElements.get("theme-studio-panel")||customElements.define("theme-studio-panel",U);export{U as ThemeStudioPanel};
