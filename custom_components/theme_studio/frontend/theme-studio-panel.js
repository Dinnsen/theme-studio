var O=globalThis,V=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),ge=new WeakMap,C=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(V&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=ge.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&ge.set(e,i))}return i}toString(){return this.cssText}},me=o=>new C(typeof o=="string"?o:o+"",void 0,Y),$=(o,...i)=>{let e=o.length===1?o[0]:i.reduce((t,s,a)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[a+1],o[0]);return new C(e,o,Y)},ve=(o,i)=>{if(V)o.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=O.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,o.appendChild(t)}},J=V?o=>o:o=>o instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return me(e)})(o):o;var{is:We,defineProperty:qe,getOwnPropertyDescriptor:Ge,getOwnPropertyNames:Ke,getOwnPropertySymbols:Ye,getPrototypeOf:Je}=Object,B=globalThis,be=B.trustedTypes,Xe=be?be.emptyScript:"",Qe=B.reactiveElementPolyfillSupport,R=(o,i)=>o,X={toAttribute(o,i){switch(i){case Boolean:o=o?Xe:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,i){let e=o;switch(i){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},fe=(o,i)=>!We(o,i),_e={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=_e){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&qe(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:a}=Ge(this.prototype,i)??{get(){return this[e]},set(r){this[e]=r}};return{get:s,set(r){let l=s?.call(this);a?.call(this,r),this.requestUpdate(i,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??_e}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let i=Je(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,t=[...Ke(e),...Ye(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(J(s))}else i!==void 0&&e.push(J(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ve(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:X).toAttribute(e,t.type);this._$Em=i,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let a=t.getPropertyOptions(s),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:X;this._$Em=s;let l=r.fromAttribute(e,a.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(i,e,t,s=!1,a){if(i!==void 0){let r=this.constructor;if(s===!1&&(a=this[i]),t??=r.getPropertyOptions(i),!((t.hasChanged??fe)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(i)&&!this.hasAttribute(r._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:a},r){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,r??e??this[i]),a!==!0||r!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,a]of t){let{wrapped:r}=a,l=this[s];r!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,Qe?.({ReactiveElement:_}),(B.reactiveElementVersions??=[]).push("2.1.2");var ae=globalThis,xe=o=>o,j=ae.trustedTypes,ye=j?j.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ee="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Ae="?"+y,Ze=`<${Ae}>`,T=document,D=()=>T.createComment(""),L=o=>o===null||typeof o!="object"&&typeof o!="function",re=Array.isArray,et=o=>re(o)||typeof o?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,we=/-->/g,$e=/>/g,k=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ke=/'/g,Se=/"/g,Me=/^(?:script|style|textarea|title)$/i,oe=o=>(i,...e)=>({_$litType$:o,strings:i,values:e}),d=oe(1),ne=oe(2),Tt=oe(3),f=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Te=new WeakMap,S=T.createTreeWalker(T,129);function Ce(o,i){if(!re(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ye!==void 0?ye.createHTML(i):i}var tt=(o,i)=>{let e=o.length-1,t=[],s,a=i===2?"<svg>":i===3?"<math>":"",r=P;for(let l=0;l<e;l++){let n=o[l],p,u,g=-1,b=0;for(;b<n.length&&(r.lastIndex=b,u=r.exec(n),u!==null);)b=r.lastIndex,r===P?u[1]==="!--"?r=we:u[1]!==void 0?r=$e:u[2]!==void 0?(Me.test(u[2])&&(s=RegExp("</"+u[2],"g")),r=k):u[3]!==void 0&&(r=k):r===k?u[0]===">"?(r=s??P,g=-1):u[1]===void 0?g=-2:(g=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?k:u[3]==='"'?Se:ke):r===Se||r===ke?r=k:r===we||r===$e?r=P:(r=k,s=void 0);let x=r===k&&o[l+1].startsWith("/>")?" ":"";a+=r===P?n+Ze:g>=0?(t.push(p),n.slice(0,g)+Ee+n.slice(g)+y+x):n+y+(g===-2?l:x)}return[Ce(o,a+(o[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},z=class o{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let a=0,r=0,l=i.length-1,n=this.parts,[p,u]=tt(i,e);if(this.el=o.createElement(p,t),S.currentNode=this.el.content,e===2||e===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=S.nextNode())!==null&&n.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(Ee)){let b=u[r++],x=s.getAttribute(g).split(y),H=/([.?@])?(.*)/.exec(b);n.push({type:1,index:a,name:H[2],strings:x,ctor:H[1]==="."?ee:H[1]==="?"?te:H[1]==="@"?ie:A}),s.removeAttribute(g)}else g.startsWith(y)&&(n.push({type:6,index:a}),s.removeAttribute(g));if(Me.test(s.tagName)){let g=s.textContent.split(y),b=g.length-1;if(b>0){s.textContent=j?j.emptyScript:"";for(let x=0;x<b;x++)s.append(g[x],D()),S.nextNode(),n.push({type:2,index:++a});s.append(g[b],D())}}}else if(s.nodeType===8)if(s.data===Ae)n.push({type:2,index:a});else{let g=-1;for(;(g=s.data.indexOf(y,g+1))!==-1;)n.push({type:7,index:a}),g+=y.length-1}a++}}static createElement(i,e){let t=T.createElement("template");return t.innerHTML=i,t}};function E(o,i,e=o,t){if(i===f)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,a=L(i)?void 0:i._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(o),s._$AT(o,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=E(o,s._$AS(o,i.values),s,t)),i}var Z=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??T).importNode(e,!0);S.currentNode=s;let a=S.nextNode(),r=0,l=0,n=t[0];for(;n!==void 0;){if(r===n.index){let p;n.type===2?p=new U(a,a.nextSibling,this,i):n.type===1?p=new n.ctor(a,n.name,n.strings,this,i):n.type===6&&(p=new se(a,this,i)),this._$AV.push(p),n=t[++l]}r!==n?.index&&(a=S.nextNode(),r++)}return S.currentNode=T,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=E(this,i,e),L(i)?i===c||i==null||i===""?(this._$AH!==c&&this._$AR(),this._$AH=c):i!==this._$AH&&i!==f&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):et(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==c&&L(this._$AH)?this._$AA.nextSibling.data=i:this.T(T.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=z.createElement(Ce(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let a=new Z(s,this),r=a.u(this.options);a.p(e),this.T(r),this._$AH=a}}_$AC(i){let e=Te.get(i.strings);return e===void 0&&Te.set(i.strings,e=new z(i)),e}k(i){re(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let a of i)s===e.length?e.push(t=new o(this.O(D()),this.O(D()),this,this.options)):t=e[s],t._$AI(a),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=xe(i).nextSibling;xe(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(i,e=this,t,s){let a=this.strings,r=!1;if(a===void 0)i=E(this,i,e,0),r=!L(i)||i!==this._$AH&&i!==f,r&&(this._$AH=i);else{let l=i,n,p;for(i=a[0],n=0;n<a.length-1;n++)p=E(this,l[t+n],e,n),p===f&&(p=this._$AH[n]),r||=!L(p)||p!==this._$AH[n],p===c?i=c:i!==c&&(i+=(p??"")+a[n+1]),this._$AH[n]=p}r&&!s&&this.j(i)}j(i){i===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},ee=class extends A{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===c?void 0:i}},te=class extends A{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==c)}},ie=class extends A{constructor(i,e,t,s,a){super(i,e,t,s,a),this.type=5}_$AI(i,e=this){if((i=E(this,i,e,0)??c)===f)return;let t=this._$AH,s=i===c&&t!==c||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,a=i!==c&&(t===c||s);s&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},se=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){E(this,i)}};var it=ae.litHtmlPolyfillSupport;it?.(z,U),(ae.litHtmlVersions??=[]).push("3.3.3");var Re=(o,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let a=e?.renderBefore??null;t._$litPart$=s=new U(i.insertBefore(D(),a),a,void 0,e??{})}return s._$AI(o),s};var le=globalThis,w=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Re(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};w._$litElement$=!0,w.finalized=!0,le.litElementHydrateSupport?.({LitElement:w});var st=le.litElementPolyfillSupport;st?.({LitElement:w});(le.litElementVersions??=[]).push("4.2.2");var Pe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},De=o=>(...i)=>({_$litDirective$:o,values:i}),F=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,t){this._$Ct=i,this._$AM=e,this._$Ci=t}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};var Le="important",at=" !"+Le,m=De(class extends F{constructor(o){if(super(o),o.type!==Pe.ATTRIBUTE||o.name!=="style"||o.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((i,e)=>{let t=o[e];return t==null?i:i+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${t};`},"")}update(o,[i]){let{style:e}=o.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(i)),this.render(i);for(let t of this.ft)i[t]==null&&(this.ft.delete(t),t.includes("-")?e.removeProperty(t):e[t]=null);for(let t in i){let s=i[t];if(s!=null){this.ft.add(t);let a=typeof s=="string"&&s.endsWith(at);t.includes("-")||a?e.setProperty(t,a?s.slice(0,-11):s,a?Le:""):e[t]=s}}return f}});var rt=[["none","None"],["soft_hairline","Hairline"],["glass_edge","Glass edge"],["etched","Etched"],["inner_glow","Inner glow"],["accent_line","Accent line"],["double_line","Double line"],["bevel_edge","Bevel"],["glow_line","Glow line"]],ot=[["none","None"],["soft_depth","Soft depth"],["glass_glow","Glass glow"],["ambient_lift","Ambient lift"],["neon_glow","Neon glow"],["studio_depth","Studio depth"],["drop_shadow","Drop shadow"],["soft_float","Soft float"],["cinematic_depth","Cinematic"]],nt=[["none","None"],["soft_veil","Soft veil"],["mesh_glow","Mesh glow"],["vignette","Vignette"],["aurora","Aurora"],["aurora_vertical","Aurora vertical"],["spotlight","Spotlight"],["diagonal_fade","Diagonal fade"],["topographic","Topographic"],["mist","Mist"],["frost","Frost"],["dual_orb","Dual orb"],["soft_stripes","Soft stripes"],["cinematic","Cinematic"],["halo","Halo"]],ze=[["sans-serif","Sans-serif"],["system-ui","System"],["Roboto","Roboto"],["Inter","Inter"],["Quicksand","Quicksand"],["Iosevka Charon Mono","Iosevka"],["Josefin Sans","Josefin Sans"],["Orbitron","Orbitron"]],Ue=[{id:"page",label:"Page background",summary:"page",toggle:"use_custom_background_color",colour:"custom_background_color"},{id:"card",label:"Cards",summary:"card",override:"card_bg_override"},{id:"bubble",label:"Bubble cards",summary:"bubble",override:"bubble_bg_override"},{id:"popup",label:"Pop-ups",cssVar:"bubble-pop-up-background-color",override:"popup_bg_override"},{id:"navbar",label:"Navbar",summary:"navbar",override:"navbar_bg_override"},{id:"accent",label:"Accent",summary:"accent",override:"accent_color_override"},{id:"slider",label:"Bubble slider",summary:"slider",override:"bubble_slider_color_override"},{id:"text",label:"Text",summary:"text",toggle:"use_custom_text_color",colour:"custom_text_color"},{id:"secondary",label:"Secondary text",summary:"secondary",override:"secondary_text_color_override"},{id:"icon",label:"Icons",summary:"icon",toggle:"use_custom_icon_color",colour:"custom_icon_color"},{id:"active",label:"Active icons",summary:"active",override:"state_icon_active_color_override"},{id:"navicon",label:"Navbar icons",summary:"nav_icon",toggle:"use_custom_navbar_icon_color",colour:"custom_navbar_icon_color"}],Ie=[{id:"headerbg",label:"Header background",cssVar:"app-header-background-color",override:"app_header_background_color_override"},{id:"headertext",label:"Header text",cssVar:"app-header-text-color",override:"app_header_text_color_override"},{id:"secondarybg",label:"Secondary background",cssVar:"secondary-background-color",override:"secondary_background_color_override"},{id:"divider",label:"Dividers",cssVar:"divider-color",override:"divider_color_override"},{id:"sidebaricon",label:"Sidebar icons",cssVar:"sidebar-icon-color",override:"sidebar_icon_color_override"},{id:"disabled",label:"Disabled text",cssVar:"disabled-text-color",override:"disabled_text_color_override"}],de=[...Ue,...Ie],W={text_page:["text","page"],text_card:["text","card"],secondary_text_card:["secondary","text","card"],icon_card:["icon","card"],active_icon_card:["active","card"],text_bubble:["text","bubble"],icon_bubble:["icon","bubble"],text_popup:["text","popup"],navbar_icon:["navicon","navbar"],header_text:["headertext","headerbg"],sidebar_icon:["sidebaricon","page"],text_on_accent:["accent"],accent_page:["accent","page"],text_sub_button:["text","bubble"]},I=[{id:"colours",label:"Colours",icon:"palette",description:"Start with one base colour. Everything set to Auto is worked out from it and kept readable.",groups:[{id:"base",title:"Base colour",controls:[{type:"base"}]},{id:"adjust",title:"Adjust",controls:[{type:"slider",key:"contrast",label:"Contrast",ends:["Soft","Strong"]},{type:"slider",key:"saturation",label:"Saturation",ends:["Muted","Vivid"]},{type:"slider",key:"tone",label:"Tone",ends:["Darker","Lighter"]},{type:"slider",key:"hue_shift",label:"Hue shift"},{type:"slider",key:"accent_strength",label:"Accent strength"},{type:"slider",key:"neutrality",label:"Neutral surfaces",ends:["Tinted","Neutral"]},{type:"segmented",key:"preview_mode",label:"Style",options:[["Relaxed","Relaxed"],["Focused","Focused"],["Vibrant","Vibrant"]]},{type:"segmented",key:"color_model",label:"Colour model",options:[["hsl","Classic"],["oklch","Even (OKLCH)"]],hint:"Even keeps shades equally bright across colours, so a yellow and a blue theme feel the same."}]},{id:"roles",title:"Colours in use",hint:"Manual colours are never changed by Theme Studio. Tap a manual swatch to pick a colour.",controls:[{type:"roles",roles:Ue}]},{id:"more",title:"More colours",collapsible:!0,controls:[{type:"roles",roles:Ie}]},{id:"finetune",title:"Fine-tune per surface",collapsible:!0,controls:[{type:"slider",key:"surface_lift"},{type:"slider",key:"accent_contrast"},{type:"slider",key:"accent_hue_shift"},{type:"slider",key:"accent_saturation"},{type:"slider",key:"card_bg_contrast"},{type:"slider",key:"card_bg_hue_shift"},{type:"slider",key:"card_bg_saturation"},{type:"slider",key:"bubble_bg_contrast"},{type:"slider",key:"bubble_bg_hue_shift"},{type:"slider",key:"bubble_bg_saturation"},{type:"slider",key:"popup_bg_contrast"},{type:"slider",key:"popup_bg_hue_shift"},{type:"slider",key:"popup_bg_saturation"},{type:"slider",key:"bubble_slider_contrast"},{type:"slider",key:"bubble_slider_hue_shift"},{type:"slider",key:"bubble_slider_saturation"},{type:"slider",key:"bubble_slider_opacity"}]},{id:"mirror",title:"Light and Dark",controls:[{type:"mirror"}]}]},{id:"surfaces",label:"Surfaces",icon:"layers",description:"Shape, glass, borders and shadows of cards, Bubble cards and pop-ups.",linkable:!0,groups:[{id:"shape",title:"Shape",hint:"Chip corners round the small pill buttons (Living room, Kitchen \u2026 in the preview). Home Assistant's own cards do not use it; the Theme Studio dashboard and your own card-mod styles can, through --theme-studio-chip-radius.",controls:[{type:"slider",key:"radius",label:"Card corners",unit:"px"},{type:"slider",key:"chip_radius",label:"Chip corners",unit:"px"}]},{id:"glass",title:"Glass",hint:"Blur shows on see-through cards: lower the opacity first.",controls:[{type:"slider",key:"card_opacity",label:"Card opacity",unit:"%"},{type:"slider",key:"blur_strength",label:"Glass blur",unit:"px"},{type:"slider",key:"bubble_bg_opacity",label:"Bubble card opacity",unit:"%"},{type:"slider",key:"popup_bg_opacity",label:"Pop-up opacity",unit:"%"},{type:"slider",key:"navbar_bg_opacity",label:"Navbar opacity",unit:"%"}]},{id:"border",title:"Border",hint:"The tiles show the border only.",controls:[{type:"tiles",key:"border_type",preview:"border",options:rt,fixed:{shadow_type:"none"}},{type:"slider",key:"border_size",label:"Border size"},{type:"slider",key:"border_opacity",label:"Border opacity",unit:"%"}]},{id:"border-fine",title:"Border colour",collapsible:!0,controls:[{type:"slider",key:"border_contrast",label:"Contrast"},{type:"slider",key:"border_hue_shift",label:"Hue shift"},{type:"slider",key:"border_saturation",label:"Saturation"}]},{id:"shadow",title:"Shadow",hint:"The tiles show the shadow only.",controls:[{type:"tiles",key:"shadow_type",preview:"shadow",options:ot,fixed:{border_type:"none"}},{type:"slider",key:"shadow_size",label:"Shadow size"},{type:"slider",key:"shadow_opacity",label:"Shadow opacity",unit:"%"}]},{id:"shadow-fine",title:"Shadow colour",collapsible:!0,controls:[{type:"slider",key:"shadow_contrast",label:"Contrast"},{type:"slider",key:"shadow_hue_shift",label:"Hue shift"},{type:"slider",key:"shadow_saturation",label:"Saturation"}]},{id:"bubble",title:"Bubble Card and pop-ups",controls:[{type:"switch",key:"bubble_use_fx",label:"Border and shadow on Bubble cards"},{type:"switch",key:"popup_use_fx",label:"Border and shadow on pop-ups"}]}]},{id:"background",label:"Background",icon:"image",description:"A plain page colour or an image behind your dashboards. The page colour is under Colours.",linkable:!0,groups:[{id:"image",title:"Image",controls:[{type:"slider",key:"background_contrast",label:"Image visibility",ends:["Page colour","Full image"]},{type:"images"}]},{id:"overlay",title:"Overlay",controls:[{type:"tiles",key:"background_overlay",preview:"overlay",options:nt},{type:"slider",key:"overlay_contrast",label:"Overlay strength"},{type:"slider",key:"overlay_offset_y",label:"Overlay starts from the top",unit:"%"},{type:"slider",key:"overlay_scale",label:"Overlay size",unit:"%"},{type:"slider",key:"overlay_spread",label:"Overlay spread",unit:"%"}]},{id:"header",title:"Header",controls:[{type:"switch",key:"enable_header_blend",label:"Blend the header into the page"},{type:"slider",key:"header_blend_height",label:"Blend height",unit:"px"}]}]},{id:"type",label:"Type",icon:"type",description:"The font your dashboards use.",linkable:!0,groups:[{id:"font",title:"Font",hint:"Theme Studio loads these fonts in Home Assistant for you; nothing to add as a resource. Orbitron has no \xF8/\xD8 of its own.",controls:[{type:"fonts"}]},{id:"custom-font",title:"Your own font",collapsible:!0,hint:"Put the font file (.woff2, .woff, .ttf or .otf) in /config/www/fonts/ and enter /local/fonts/<file>. Theme Studio loads it for you.",controls:[{type:"switch",key:"use_custom_font",label:"Use my own font"},{type:"text",key:"custom_font_family",label:"Font family name",placeholder:"My Font"},{type:"text",key:"custom_font_path",label:"Font file",placeholder:"/local/fonts/my-font.woff2"}]}]},{id:"check",label:"Check",icon:"contrast",description:"Every text and icon colour against what it sits on.",groups:[]}];function q(o,i){if(o.override){let e=String(i[o.override]??"auto").trim().toLowerCase();return e!==""&&e!=="auto"}if(o.toggle){let e=i[o.toggle];return e===!0||e==="on"}return!1}function ce(o,i){let e=o.override??o.colour;return e?String(i[e]??""):""}function pe(o,i){return o.override?{[o.override]:i}:o.toggle&&o.colour?{[o.toggle]:"on",[o.colour]:i}:{}}function he(o){return o.override?{[o.override]:"auto"}:o.toggle?{[o.toggle]:"off"}:{}}var Ne=$`
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
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-top: 1px solid var(--ts-line);
  }
  .role:first-child {
    border-top: 0;
  }
  .role-text {
    min-width: 0;
  }
  .role-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .badge.small {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 6px;
  }
  .sec-foot {
    border-top: 1px solid var(--ts-line);
    padding-top: 18px;
    display: flex;
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
  .tr-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .tr-title {
    font-weight: 600;
    font-size: 14px;
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
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .tile {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel2);
    border-radius: 16px;
    padding: 6px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
    font-weight: 600;
    font-size: 12.5px;
    min-width: 0;
  }
  .tile:hover:not(:disabled) {
    border-color: var(--ts-muted);
  }
  .tile.on {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
    background: var(--ts-panel);
  }
  .tile-label {
    padding: 0 4px 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tile-art {
    height: 64px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 14px;
    overflow: hidden;
    background-color: var(--primary-background-color, var(--ts-panel));
  }
  .tile-art.overlay {
    background-image: var(--theme-studio-background-overlay-preview, none);
    background-size: cover;
  }
  .tile-card {
    width: 100%;
    height: 100%;
    background: var(--ha-card-background, var(--ts-panel));
    border-radius: min(var(--ha-card-border-radius, 12px), 12px);
    box-shadow: var(--ha-card-box-shadow, none);
    border: var(--ha-card-border-width, 0px) solid var(--ha-card-border-color, transparent);
  }
  .font-art {
    height: 64px;
    border-radius: 11px;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10px;
    overflow: hidden;
  }
  .font-aa {
    font-size: 20px;
    line-height: 1.15;
    font-weight: 600;
  }
  .font-sm {
    font-size: 11.5px;
    color: var(--ts-muted);
    font-weight: 400;
  }
  .font-aa,
  .font-sm {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .image.none,
  .image.upload {
    position: relative;
    justify-content: flex-start;
  }
  .image-none {
    height: 64px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: var(--ts-muted);
    background: var(--ts-panel);
    border: 1px dashed var(--ts-line);
  }
  .image.upload input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .image.upload.busy {
    opacity: 0.6;
  }
  .opts.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .share-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .text-input.area {
    height: auto;
    padding: 10px 12px;
    resize: vertical;
    font-size: 12.5px;
    line-height: 1.5;
  }
  .file-btn {
    position: relative;
    align-self: flex-start;
  }
  .file-btn input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
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
    .images,
    .tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .toast {
      bottom: 16px;
    }
  }
`;var lt={palette:"M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M15 7.8h.01",back:"m15 18-6-6 6-6",refresh:"M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",sun:"M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",split:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM12 4v16",phone:"M9.5 2.5h5A2.5 2.5 0 0 1 17 5v14a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 19V5a2.5 2.5 0 0 1 2.5-2.5zM11 18h2",tablet:"M6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3zM11 18h2",desktop:"M4.5 4h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 21h8M12 17v4",bulb:"M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",thermo:"M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",home:"M3 11 12 4l9 7M5 10v10h14V10",image:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-9 9",lock:"M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3",edit:"M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",contrast:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18M12 7h4.5M12 11h6M12 15h5.5",plus:"M12 5v14M5 12h14",grid:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",layers:"M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5",type:"M4 7V5h16v2M12 5v14M9 19h6",trash:"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",undo:"M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",redo:"m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",upload:"M12 15V4M7 9l5-5 5 5M5 20h14",download:"M12 4v11M7 10l5 5 5-5M5 20h14",copy:"M9 9h10v11H9zM5 15V4h10",swap:"M7 7h11l-3-3M17 17H6l3 3",check:"m5 12 5 5 9-10",close:"M6 6l12 12M18 6 6 18",chevron:"m6 9 6 6 6-6",wand:"m4 20 11-11M14 3l1 2.2 2.2 1-2.2 1L14 9.4l-1-2.2-2.2-1 2.2-1z"};function h(o,i=20){return d`<svg
    width=${i}
    height=${i}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${ne`<path d=${lt[o]}></path>`}
  </svg>`}function He(o=16){return d`<svg width=${o} height=${o} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    ${ne`<path d="M8 5v14l11-7z"></path>`}
  </svg>`}function Oe(){return d`
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
  `}var Ve=$`
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
    border-radius: var(--theme-studio-chip-radius, 999px);
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
`;var Be=$`
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
`;var dt=/^\/theme\/([^/]+)/,ct=/^[a-z0-9-]+$/,pt=/[;{}<>]/,ht=/^#?([0-9a-f]{6})$/i,G=["light","dark"],ut=900,gt=90,mt=800,vt=60,bt=250,je="theme-studio-linked",_t="/api/theme_studio/background",ft={not_an_image:"That file is not an image.",unsupported_format:"Use a PNG, JPEG, WebP or GIF image.",too_large:"The image is larger than 15 MB."};function v(o){if(o&&typeof o=="object"){let i=o;if(i.code==="name_taken")return"That name is already used by another theme.";if(i.code==="unauthorized")return"Only administrators can change themes.";if("message"in i)return String(i.message)}return String(o)}function ue(o){let i={};for(let[e,t]of Object.entries(o))ct.test(e)&&!pt.test(t)&&(i[`--${e}`]=t);return i}function xt(o){if(!o.image||!o.image.startsWith("/"))return o.page;let i=encodeURI(o.image).replace(/'/g,"%27");return`linear-gradient(${o.page}cc, ${o.page}cc), url('${i}') center / cover`}function Fe(o){let i=o.filter(e=>!e.ok).length;return i===0?`all ${o.length} readable`:`${i} of ${o.length} to check`}function yt(o){let i=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i.exec(o),e;if(i)e=[i[1],i[2],i[3]].map(Number);else{let t=/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i.exec(o);t&&(e=[t[1],t[2],t[3]].map(s=>Number(s)*255))}return e?`#${e.map(t=>Math.round(Math.min(255,Math.max(0,t))).toString(16).padStart(2,"0")).join("")}`.toUpperCase():""}function M(o){let i=ht.exec(o.trim());return i?`#${i[1].toUpperCase()}`:void 0}function K(o){return{light:{...o.light},dark:{...o.dark}}}var N=class extends w{constructor(){super();this._schema=new Map;this._schemaLoading=!1;this._dirty=new Set;this._nameDirty=!1;this._saving=!1;this._saveAgain=!1;this._previewTimers={};this._previewSeq={light:0,dark:0};this._lastTime=0;this._libraryStale=!1;this._wantedTiles=new Map;this._tileSeq=0;this._closeDialog=()=>{this._busy||(this._dialog=void 0)};this.narrow=!1,this._loading=!1,this._filter="all",this._variant="light",this._both=!1,this._device="phone",this._previews={},this._probe={},this._section="colours",this._open=new Set,this._saveState="saved",this._history=[],this._future=[],this._busy=!1,this._newMode="preset",this._newSource="default",this._newColour="#3A6EA5",this._newName="",this._tiles={},this._useScope="device",this._importText="",this._inUse={everyone:[]},this._linked=new Set;try{let e=JSON.parse(window.localStorage.getItem(je)??"[]");Array.isArray(e)&&(this._linked=new Set(e.map(String)))}catch{}}disconnectedCallback(){super.disconnectedCallback(),this._flush()}get _slug(){let e=dt.exec(this.route?.path??"");return e?decodeURIComponent(e[1]):void 0}get _canEdit(){return this.hass?.user?.is_admin!==!1}willUpdate(e){e.has("hass")&&this.hass&&(this.toggleAttribute("dark",!!this.hass.themes?.darkMode),!this._themes&&!this._loading&&!this._error&&this._loadThemes(),!this._schema.size&&!this._schemaLoading&&this._loadSchema());let t=this._slug;this.hass&&t&&t!==this._detailSlug&&this._loadDetail(t),e.has("_section")&&this._section==="background"&&this._loadBackgrounds(),!t&&this._libraryStale&&e.has("route")&&(this._libraryStale=!1,this._loadThemes())}updated(e){e.has("_previews")&&this._resolveProbe(),this._wantedTiles.size&&(window.clearTimeout(this._tileTimer),this._tileTimer=window.setTimeout(()=>void this._loadTiles(),bt))}async _loadThemes(){if(this.hass){this._loading=!0,this._error=void 0;try{let e=await this.hass.callWS({type:"theme_studio/themes"});this._themes=e.themes,this._loadInUse()}catch(e){this._error=v(e)}finally{this._loading=!1}}}async _loadInUse(){if(this.hass)try{let e=await this.hass.callWS({type:"frontend/get_themes"}),t=[e.default_theme,e.default_dark_theme].filter(s=>!!s&&s!=="default");this._inUse={everyone:t,device:this.hass.selectedTheme?.theme}}catch{this._inUse={everyone:[],device:this.hass.selectedTheme?.theme}}}_inUseText(e){if(this._inUse.everyone.includes(e))return"In use \xB7 everyone";if(this._inUse.device===e)return"In use \xB7 this device"}async _loadSchema(){if(this.hass){this._schemaLoading=!0;try{let e=await this.hass.callWS({type:"theme_studio/schema"});this._schema=new Map(e.settings.map(t=>[t.key,t])),this.requestUpdate()}catch(e){this._error=v(e)}finally{this._schemaLoading=!1}}}async _loadDetail(e){if(this.hass){await this._flush(),this._detailSlug=e,this._edit=void 0,this._previews={},this._probe={},this._detailError=void 0,this._history=[],this._future=[],this._hexDraft=void 0,this._saveState="saved",this._saveError=void 0;try{let t=await this.hass.callWS({type:"theme_studio/theme",slug:e});if(this._detailSlug!==e)return;if(!t.light||!t.dark){this._detailError="This theme could not be built.";return}this._edit={slug:t.slug,name:t.name,builtin:t.builtin,settings:{light:{...t.light.settings},dark:{...t.dark.settings}}},this._previews={light:t.light,dark:t.dark}}catch(t){this._detailSlug===e&&(this._detailError=v(t))}}}async _loadBackgrounds(){if(!(!this.hass||this._backgrounds))try{let e=await this.hass.callWS({type:"theme_studio/backgrounds"});this._backgrounds=e.images,this._newImage=this._newImage??e.images[0]?.file}catch{this._backgrounds=[]}}_navigate(e,t=!1){t?window.history.replaceState(null,"",e):window.history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:t}}))}_prefix(){return this.route?.prefix??"/theme-studio-panel"}_openTheme(e){this._navigate(`${this._prefix()}/theme/${encodeURIComponent(e)}`)}async _back(){await this._flush(),this._detailSlug=void 0,this._edit=void 0,this._navigate(this._prefix())}_refresh(){this._themes=void 0,this._error=void 0,this._loadThemes()}_showToast(e){this._toast=e,window.clearTimeout(this._toastTimer),this._toastTimer=window.setTimeout(()=>{this._toast=void 0},3600)}_snapshot(){return this._edit?{name:this._edit.name,settings:K(this._edit.settings)}:void 0}_pushHistory(e){let t=Date.now(),s=e!==void 0&&e===this._lastKey&&t-this._lastTime<mt;if(this._lastKey=e,this._lastTime=t,s)return;let a=this._snapshot();a&&(this._history=[...this._history,a].slice(-vt),this._future=[])}_change(e,t,s){if(!this._edit||!this._canEdit)return;this._pushHistory(s);let a=K(this._edit.settings);for(let r of e)a[r]={...a[r],...t},this._dirty.add(r),this._schedulePreview(r);this._edit={...this._edit,settings:a},this._scheduleSave()}_replaceVariant(e,t){if(!this._edit||!this._canEdit)return;this._pushHistory();let s=K(this._edit.settings);s[e]={...s[e],...t},this._dirty.add(e),this._edit={...this._edit,settings:s},this._schedulePreview(e),this._scheduleSave()}_rename(e){!this._edit||!this._canEdit||(this._pushHistory("name"),this._edit={...this._edit,name:e},this._nameDirty=!0,e.trim()&&this._scheduleSave())}_restore(e){let t=this[e],s=this._snapshot();if(!t.length||!this._edit||!s)return;let a=t[t.length-1];e==="_history"?(this._history=t.slice(0,-1),this._future=[...this._future,s]):(this._future=t.slice(0,-1),this._history=[...this._history,s]),this._lastKey=void 0,this._hexDraft=void 0,this._edit={...this._edit,name:a.name,settings:K(a.settings)},this._nameDirty=this._nameDirty||a.name!==s.name;for(let r of G)this._dirty.add(r),this._schedulePreview(r);this._scheduleSave()}_schedulePreview(e){window.clearTimeout(this._previewTimers[e]),this._previewTimers[e]=window.setTimeout(()=>void this._runPreview(e),gt)}async _runPreview(e){if(!this.hass||!this._edit)return;let t=++this._previewSeq[e];try{let s=await this.hass.callWS({type:"theme_studio/preview",settings:this._edit.settings[e]});t===this._previewSeq[e]&&(this._previews={...this._previews,[e]:s})}catch(s){this._showToast(`Preview failed: ${v(s)}`)}}_scheduleSave(e=ut){this._saveState="unsaved",window.clearTimeout(this._saveTimer),this._saveTimer=window.setTimeout(()=>void this._save(),e)}async _flush(){window.clearTimeout(this._saveTimer),(this._dirty.size||this._nameDirty)&&await this._save()}async _save(){if(!this.hass||!this._edit||!this._canEdit)return;if(this._saving){this._saveAgain=!0;return}if(!this._dirty.size&&!this._nameDirty){this._saveState="saved";return}this._saving=!0,this._saveState="saving";let e=new Set(this._dirty),t=this._nameDirty;this._dirty.clear(),this._nameDirty=!1;try{this._edit.builtin&&(await this._fork(),G.forEach(r=>e.add(r)));let s=this._edit,a={type:"theme_studio/theme/save",slug:s.slug};t&&s.name.trim()&&(a.name=s.name.trim());for(let r of e)a[r]=s.settings[r];await this.hass.callWS(a),this._libraryStale=!0,this._saveError=void 0,this._saveState=this._dirty.size||this._nameDirty?"unsaved":"saved"}catch(s){e.forEach(a=>this._dirty.add(a)),this._nameDirty=this._nameDirty||t,this._saveState="error",this._saveError=v(s)}finally{this._saving=!1,this._saveAgain&&(this._saveAgain=!1,this._scheduleSave(200))}}async _fork(){if(!this.hass||!this._edit)return;let e=this._edit.name!==this._presetName()?this._edit.name:`${this._edit.name} (copy)`,t=await this.hass.callWS({type:"theme_studio/theme/new",source:this._edit.slug,name:e.trim()||`${this._presetName()} (copy)`});this._edit={...this._edit,slug:t.slug,name:t.name,builtin:!1},this._detailSlug=t.slug,this._navigate(`${this._prefix()}/theme/${encodeURIComponent(t.slug)}`,!0),this._showToast(`Built-in presets stay as they are. Your changes are saved in \u201C${t.name}\u201D.`)}_presetName(){return this._themes?.find(t=>t.slug===this._edit?.slug)?.name??this._edit?.name??""}async _use(){if(!this.hass||!this._edit)return;this._busy=!0;let e=this._useScope;try{await this._flush();let t=await this.hass.callWS({type:"theme_studio/theme/use",slug:this._edit.slug,scope:e});e==="device"&&this.dispatchEvent(new CustomEvent("settheme",{detail:{theme:t.theme},bubbles:!0,composed:!0})),this._dialog=void 0,this._libraryStale=!0,this._inUse=e==="everyone"?{...this._inUse,everyone:[t.theme]}:{...this._inUse,device:t.theme},this._showToast(e==="everyone"?`\u201C${t.theme}\u201D is now the theme for everyone.`:`\u201C${t.theme}\u201D is now used on this device.`)}catch(t){this._showToast(`Could not use the theme: ${v(t)}`)}finally{this._busy=!1}}async _export(e){if(!(!this.hass||!this._edit))try{await this._flush();let t=await this.hass.callWS({type:"theme_studio/theme/export",slug:this._edit.slug});if(e==="copy"){try{await navigator.clipboard.writeText(t.share_string),this._showToast("Share code copied. Paste it into Import in another Theme Studio.")}catch{this._importText=t.share_string,this._showToast("Copying is blocked here; the share code is in Import on the start page.")}return}let s=new Blob([`${JSON.stringify(t.document,null,2)}
`],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download=t.file_name,a.click(),window.setTimeout(()=>URL.revokeObjectURL(a.href),2e3),this._showToast(`${t.file_name} is downloaded.`)}catch(t){this._showToast(`Could not share: ${v(t)}`)}}async _import(){if(!(!this.hass||!this._importText.trim())){this._busy=!0;try{let e=await this.hass.callWS({type:"theme_studio/theme/import",data:this._importText.trim()});this._dialog=void 0,this._importText="",this._libraryStale=!0,this._themes=void 0,this._loadThemes(),this._openTheme(e.slug),this._showToast(e.renamed?`Imported as \u201C${e.name}\u201D, because the name was taken.`:`\u201C${e.name}\u201D is imported.`)}catch(e){let t=e;this._showToast(t?.code&&t.code!=="unknown_error"?"That is not a Theme Studio share code or theme file.":`Could not import: ${v(e)}`)}finally{this._busy=!1}}}async _delete(){if(!this.hass||!this._edit)return;this._busy=!0;let{slug:e,name:t}=this._edit;try{window.clearTimeout(this._saveTimer),this._dirty.clear(),this._nameDirty=!1,await this.hass.callWS({type:"theme_studio/theme/delete",slug:e}),this._dialog=void 0,this._libraryStale=!0,this._detailSlug=void 0,this._edit=void 0,this._navigate(this._prefix()),this._showToast(`\u201C${t}\u201D is deleted. A backup copy stays in the user_themes folder.`)}catch(s){this._showToast(`Could not delete: ${v(s)}`)}finally{this._busy=!1}}async _mirror(){if(!this.hass||!this._edit)return;let e=this._variant,t=e==="light"?"dark":"light";try{let s=await this.hass.callWS({type:"theme_studio/mirror",settings:this._edit.settings[e],target:t});this._replaceVariant(t,s.settings),this._showToast(`${t==="dark"?"Dark":"Light"} is now a copy of ${e==="light"?"Light":"Dark"}. Undo brings the old one back.`)}catch(s){this._showToast(`Could not copy: ${v(s)}`)}}async _createNew(){if(!this.hass)return;let e={type:"theme_studio/theme/new"};if(this._newName.trim()&&(e.name=this._newName.trim()),this._newMode==="image"){if(!this._newImage)return;e.image=this._newImage}else e.source=this._newMode==="colour"?"default":this._newSource,this._newMode==="colour"&&(e.base_color=this._newColour);this._busy=!0;try{let t=await this.hass.callWS(e);this._dialog=void 0,this._newName="",this._libraryStale=!0,this._themes=void 0,this._loadThemes(),this._openTheme(t.slug),this._showToast(`\u201C${t.name}\u201D is created with a light and a dark variant.`)}catch(t){this._showToast(`Could not create the theme: ${v(t)}`)}finally{this._busy=!1}}_isLinked(e){return!!(e.linkable&&this._edit&&this._linked.has(this._edit.slug))}_targets(e){return this._isLinked(e)?[...G]:[this._variant]}_toggleLinked(){if(!this._edit)return;let e=new Set(this._linked);e.has(this._edit.slug)?e.delete(this._edit.slug):e.add(this._edit.slug),this._linked=e;try{window.localStorage.setItem(je,JSON.stringify([...e]))}catch{}}_tileSignature(e){let t=this._edit?.settings[this._variant]??{};return`${this._edit?.slug}|${this._variant}|${JSON.stringify({...t,[e.key]:""})}`}async _loadTiles(){if(!this.hass||!this._edit)return;let e=[...this._wantedTiles.values()];this._wantedTiles.clear();let t=++this._tileSeq,s=this._edit.settings[this._variant],a={};for(let r of e){let l=this._tileSignature(r);try{let n=await this.hass.callWS({type:"theme_studio/preview_options",settings:s,key:r.key,values:r.options.map(([p])=>p),fixed:r.fixed??{}});a[r.key]={signature:l,options:Object.fromEntries(n.options.map(p=>[p.value,p.variables]))}}catch{a[r.key]={signature:l,options:{}}}}t===this._tileSeq&&(this._tiles={...this._tiles,...a})}async _upload(e,t){if(!this.hass?.fetchWithAuth){this._showToast("Uploading needs a newer Home Assistant frontend.");return}let s=new FormData;s.append("file",e,e.name),this._busy=!0;try{let a=await this.hass.fetchWithAuth(_t,{method:"POST",body:s}),r=await a.json().catch(()=>({}));if(!a.ok||!r.ok||!r.url)throw new Error(ft[r.reason??""]??r.message??a.statusText);this._backgrounds=void 0,await this._loadBackgrounds(),this._change(this._targets(t),{use_background_image:"on",background_image_url:r.url}),this._showToast(`${r.file} is uploaded and in use.`)}catch(a){this._showToast(`Could not upload: ${v(a)}`)}finally{this._busy=!1}}_resolveProbe(){let e=this.renderRoot.querySelector(".probe"),t=e?.querySelector("span");if(!e||!t)return;let s={};for(let a of G){let r=this._previews[a];if(!r)continue;e.removeAttribute("style");for(let[n,p]of Object.entries(ue(r.variables)))e.style.setProperty(n,p);let l={};for(let n of de)n.cssVar&&(t.style.color=`var(--${n.cssVar})`,l[n.id]=yt(getComputedStyle(t).color));s[a]=l}this._probe=s}_roleColour(e,t){let s=this._edit?.settings[t];if(s&&q(e,s))return M(ce(e,s))??ce(e,s);let a=this._previews[t];return e.summary&&a?String(a.summary[e.summary]).toUpperCase():this._probe[t]?.[e.id]??""}render(){return d`
      ${this._slug?this._renderEditor(this._slug):this._renderLibrary()}
      ${this._dialog==="new"?this._renderNewDialog():c}
      ${this._dialog==="delete"?this._renderDeleteDialog():c}
      ${this._dialog==="use"?this._renderUseDialog():c}
      ${this._dialog==="import"?this._renderImportDialog():c}
      ${this._toast?d`<div class="toast" role="status">${this._toast}</div>`:c}
    `}_renderLibrary(){let e=this._themes??[],t=e.filter(a=>this._filter==="all"?!0:this._filter==="mine"?!a.builtin:a.builtin),s=[{title:"Mine",items:t.filter(a=>!a.builtin)},{title:"Built-in presets",items:t.filter(a=>a.builtin)}].filter(a=>a.items.length>0);return d`
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
          ${this._canEdit?d`<button class="btn" aria-label="Import a theme" @click=${()=>this._dialog="import"}>
                ${h("download",18)}<span class="hide-p">Import</span>
              </button>`:c}
          ${this._canEdit?d`<button
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
          ${this._error?d`<div class="message">
                <strong>Could not load the themes</strong>
                <span class="hint">${this._error}</span>
                <button class="btn sm" @click=${this._refresh}>Try again</button>
              </div>`:c}
          ${this._loading&&!this._themes?d`<div class="loading">Loading themes…</div>`:c}
          ${s.map(a=>d`
              <div class="gtitle">${a.title} · ${a.items.length}</div>
              <div class="grid">${a.items.map(r=>this._renderCard(r))}</div>
            `)}
        </main>
      </div>
    `}_filterButton(e,t){return d`<button
      class=${this._filter===e?"on":""}
      aria-pressed=${this._filter===e?"true":"false"}
      @click=${()=>{this._filter=e}}
    >
      ${t}
    </button>`}_renderCard(e){let t=(e.light?.failing??0)+(e.dark?.failing??0);return d`
      <button class="tcard" @click=${()=>this._openTheme(e.slug)} aria-label=${`Open ${e.name}`}>
        <div class="mini">${this._renderMini(e.light)}${this._renderMini(e.dark)}</div>
        <div class="tmeta">
          <div class="tmeta-text">
            <div class="tname">${e.name}</div>
            <div class="tsub">${e.builtin?"Built-in preset":"Mine"}</div>
          </div>
          ${this._inUseText(e.name)?d`<span class="badge">${this._inUseText(e.name)}</span>`:t?d`<span class="badge warn">${t} to check</span>`:c}
        </div>
      </button>
    `}_renderMini(e){if(!e)return d`<div class="mini-v empty">–</div>`;let t=e.summary,s=`${Math.min(t.radius,14)*.5}px`;return d`
      <div class="mini-v" style=${m({background:xt(t)})}>
        <div class="mini-line" style=${m({background:t.text})}></div>
        <div class="mini-card" style=${m({background:t.card,borderRadius:s})}>
          <span class="mini-dot" style=${m({background:t.accent})}></span>
          <span class="mini-bar" style=${m({background:t.text})}></span>
        </div>
        <div class="mini-card" style=${m({background:t.card,borderRadius:s})}>
          <span class="mini-dot" style=${m({background:t.icon})}></span>
          <span class="mini-bar" style=${m({background:t.secondary})}></span>
        </div>
        <div class="mini-nav" style=${m({background:t.navbar})}></div>
      </div>
    `}_statusText(){if(!this._canEdit)return"View only \xB7 ask an administrator to change themes";if(!this._edit)return"Loading\u2026";if(this._edit.builtin&&this._saveState==="saved")return"Built-in preset \xB7 your first change makes a copy";switch(this._saveState){case"saving":return"Saving\u2026";case"unsaved":return"Unsaved changes";case"error":return`Not saved: ${this._saveError??"unknown error"}`;default:return"All changes saved"}}_failing(e){return this._previews[e]?.contrast.filter(t=>!t.ok).length??0}_renderEditor(e){let t=this._edit?.slug===e||this._detailSlug===e?this._edit:void 0,s=this._themes?.find(n=>n.slug===e),a=t?.name??s?.name??e,r=this._failing(this._variant),l=I.find(n=>n.id===this._section)??I[0];return d`
      <div class="shell">
        <header class="bar">
          <button class="btn icon" @click=${()=>void this._back()} aria-label="Back to all themes">${h("back")}</button>
          <div class="titlebox">
            <input
              class="name"
              .value=${a}
              ?disabled=${!t||!this._canEdit}
              aria-label="Theme name"
              spellcheck="false"
              maxlength="60"
              @input=${n=>this._rename(n.target.value)}
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
          ${t&&this._canEdit?d`
                <button class="btn primary" ?disabled=${this._busy} aria-label="Use theme" @click=${()=>this._dialog="use"}>
                  ${h("check",18)}<span class="hide-t">Use theme</span>
                </button>
              `:c}
        </header>
        ${this._detailError?d`<div class="message">
              <strong>Could not load ${a}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${()=>void this._back()}>Back to all themes</button>
            </div>`:d`<div class="editor">
              <nav class="rail" aria-label="Sections">
                ${I.map(n=>d`<button class="rail-btn ${n.id===l.id?"on":""}" @click=${()=>this._section=n.id}>
                    ${h(n.icon,22)}${n.label}
                    ${n.id==="check"&&r?d`<span class="count">${r}</span>`:c}
                  </button>`)}
              </nav>
              <section class="ctl" aria-label="Controls">
                <div class="chips" role="group" aria-label="Sections">
                  ${I.map(n=>d`<button class="chip ${n.id===l.id?"on":""}" @click=${()=>this._section=n.id}>
                      ${n.label}
                      ${n.id==="check"&&r?d`<span class="count">${r}</span>`:c}
                    </button>`)}
                </div>
                ${t?.builtin&&this._canEdit?d`<div class="banner">
                      ${h("lock",18)}
                      <span>This is a built-in preset. Change anything and Theme Studio makes your own copy; the preset itself stays untouched.</span>
                    </div>`:c}
                ${t&&this._schema.size?d`<div class="sec">
                      <div>
                        <h2 class="sh">${l.label}</h2>
                        <p class="sp">${l.description}</p>
                      </div>
                      ${l.linkable&&this._canEdit?this._renderLinkRow(l):c}
                      ${l.id==="check"?this._renderCheck():l.groups.map(n=>this._renderGroup(n,l))}
                      ${!t.builtin&&this._canEdit?d`<div class="sec-foot">
                            <button class="btn danger" @click=${()=>this._dialog="delete"}>${h("trash",18)}Delete theme</button>
                          </div>`:c}
                    </div>`:d`<div class="loading">Loading…</div>`}
              </section>
              ${this._renderPreview()}
              <div class="probe" aria-hidden="true"><span></span></div>
            </div>`}
      </div>
    `}_variantButton(e,t){let s=this._variant===e;return d`<button
      class=${s?"on":""}
      aria-pressed=${s?"true":"false"}
      @click=${()=>{this._variant=e,this._hexDraft=void 0}}
    >
      ${h(e==="light"?"sun":"moon",17)}<span class="hide-p">${t}</span>
    </button>`}_renderLinkRow(e){let t=this._isLinked(e);return d`<button class="toggle-row" aria-pressed=${t?"true":"false"} @click=${()=>this._toggleLinked()}>
      <span class="tr-text">
        <span class="tr-title">Same for Light and Dark</span>
        <span class="hint">${t?"Changes here apply to both variants.":`Changes here only apply to ${this._variant==="light"?"Light":"Dark"}.`}</span>
      </span>
      <span class="switch ${t?"on":""}" aria-hidden="true"></span>
    </button>`}_renderGroup(e,t){let s=!e.collapsible||this._open.has(e.id),a=()=>{let r=new Set(this._open);r.has(e.id)?r.delete(e.id):r.add(e.id),this._open=r};return d`
      <div class="group">
        ${e.collapsible?d`<button class="group-head ${s?"open":""}" aria-expanded=${s?"true":"false"} @click=${a}>
              <span class="h">${e.title}</span>${h("chevron",18)}
            </button>`:d`<div class="h">${e.title}</div>`}
        ${s?e.controls.map(r=>this._renderControl(r,t)):c}
        ${s&&e.hint?d`<p class="hint">${e.hint}</p>`:c}
      </div>
    `}_renderControl(e,t){let s=this._edit?.settings[this._variant];if(!s)return c;let a=this._targets(t);switch(e.type){case"base":return this._renderBase(s);case"slider":return this._renderSlider(e,s,a);case"segmented":return this._renderSegmented(e,s,a);case"roles":return d`<div class="roles">${e.roles.map(r=>this._renderRole(r,s))}</div>`;case"mirror":return this._renderMirror();case"switch":return this._renderSwitch(e,s,a);case"text":return this._renderText(e,s,a);case"tiles":return this._renderTiles(e,s,a);case"images":return this._renderImages(s,a,t);case"fonts":return this._renderFonts(s,a)}}_renderSwitch(e,t,s){let a=t[e.key]==="on"||t[e.key]===!0;return d`<button
      class="toggle-row"
      aria-pressed=${a?"true":"false"}
      ?disabled=${!this._canEdit}
      @click=${()=>this._change(s,{[e.key]:a?"off":"on"})}
    >
      <span class="tr-text">
        <span class="tr-title">${e.label}</span>
        ${e.hint?d`<span class="hint">${e.hint}</span>`:c}
      </span>
      <span class="switch ${a?"on":""}" aria-hidden="true"></span>
    </button>`}_renderText(e,t,s){let a=`ts-${e.key}`;return d`<div class="field">
      <label class="lbl" for=${a}>${e.label}</label>
      <input
        id=${a}
        class="text-input plain"
        maxlength="255"
        spellcheck="false"
        .value=${String(t[e.key]??"")}
        placeholder=${e.placeholder??""}
        ?disabled=${!this._canEdit}
        @input=${r=>this._change(s,{[e.key]:r.target.value},`${e.key}-text`)}
      />
      ${e.hint?d`<p class="hint">${e.hint}</p>`:c}
    </div>`}_renderTiles(e,t,s){let a=String(t[e.key]??""),r=this._tiles[e.key];return(!r||r.signature!==this._tileSignature(e))&&this._wantedTiles.set(e.key,e),d`<div class="tiles">
      ${e.options.map(([l,n])=>{let p=r?.options[l],u=p?m(ue(p)):c;return d`<button
          class="tile ${a===l?"on":""}"
          aria-pressed=${a===l?"true":"false"}
          ?disabled=${!this._canEdit}
          @click=${()=>this._change(s,{[e.key]:l})}
        >
          <div class="tile-art ${e.preview}" style=${u}>
            ${e.preview==="overlay"?c:d`<div class="tile-card"></div>`}
          </div>
          <span class="tile-label">${n}</span>
        </button>`})}
    </div>`}_renderImages(e,t,s){let a=e.use_background_image==="on"||e.use_background_image===!0,r=String(e.background_image_url??""),l=this._backgrounds;return d`<div class="images">
      <button
        class="image none ${a?"":"on"}"
        aria-pressed=${a?"false":"true"}
        ?disabled=${!this._canEdit}
        @click=${()=>this._change(t,{use_background_image:"off"})}
      >
        <span class="image-none">${h("close",22)}</span><span>No image</span>
      </button>
      ${(l??[]).map(n=>d`<button
          class="image ${a&&r===n.url?"on":""}"
          aria-pressed=${a&&r===n.url?"true":"false"}
          ?disabled=${!this._canEdit}
          @click=${()=>this._change(t,{use_background_image:"on",background_image_url:n.url})}
        >
          <img src=${n.url} alt="" loading="lazy" /><span>${n.file}</span>
        </button>`)}
      ${this._canEdit?d`<label class="image upload ${this._busy?"busy":""}">
            <span class="image-none">${h("upload",22)}</span><span>${this._busy?"Uploading\u2026":"Upload image"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              ?disabled=${this._busy}
              @change=${n=>{let p=n.target,u=p.files?.[0];p.value="",u&&this._upload(u,s)}}
            />
          </label>`:c}
    </div>
    ${l===void 0?d`<p class="hint">Loading images…</p>`:c}`}_renderFonts(e,t){let s=e.use_custom_font==="on"||e.use_custom_font===!0,a=String(e.primary_font_family??"");return d`<div class="tiles">
      ${ze.map(([r,l])=>{let n=!s&&a===r;return d`<button
          class="tile ${n?"on":""}"
          aria-pressed=${n?"true":"false"}
          ?disabled=${!this._canEdit}
          @click=${()=>this._change(t,{primary_font_family:r,use_custom_font:"off"})}
        >
          <div class="font-art" style=${m({fontFamily:`"${r}", system-ui, sans-serif`})}>
            <span class="font-aa">Aa 21°</span><span class="font-sm">Living room</span>
          </div>
          <span class="tile-label">${l}</span>
        </button>`})}
    </div>`}_renderBase(e){let t=M(String(e.base_color??""))??"#344334",s=a=>{let r=M(a);r&&this._change([this._variant],{base_color:r},`base_color-${this._variant}`)};return d`
      <div class="base">
        <label class="swatch-big" style=${m({background:t})}>
          <input
            type="color"
            class="cpick"
            .value=${t.toLowerCase()}
            ?disabled=${!this._canEdit}
            aria-label="Pick base colour"
            @input=${a=>{this._hexDraft=void 0,s(a.target.value)}}
          />
        </label>
        <div class="field" style="flex: 1; min-width: 0">
          <label class="lbl" for="ts-hex">Hex code</label>
          <input
            id="ts-hex"
            class="text-input"
            .value=${this._hexDraft??t}
            ?disabled=${!this._canEdit}
            spellcheck="false"
            maxlength="7"
            @input=${a=>{let r=a.target.value;this._hexDraft=r,s(r)}}
            @blur=${()=>this._hexDraft=void 0}
          />
        </div>
      </div>
    `}_renderSlider(e,t,s){let a=this._schema.get(e.key);if(!a)return c;let r=Number(t[e.key]??a.default??0),l=`ts-${e.key}`;return d`
      <div class="field">
        <div class="lbl">
          <label for=${l}>${e.label??a.label}</label><span class="val">${Math.round(r)}${e.unit?` ${e.unit}`:""}</span>
        </div>
        <input
          id=${l}
          type="range"
          min=${a.min??0}
          max=${a.max??100}
          step=${a.step??1}
          .value=${String(r)}
          ?disabled=${!this._canEdit}
          @input=${n=>this._change(s,{[e.key]:Number(n.target.value)},`${e.key}-${s.join()}`)}
        />
        ${e.ends?d`<div class="ends"><span>${e.ends[0]}</span><span>${e.ends[1]}</span></div>`:c}
      </div>
    `}_renderSegmented(e,t,s){let a=this._schema.get(e.key);if(!a)return c;let r=String(t[e.key]??a.default??"");return d`
      <div class="field">
        <div class="lbl">${e.label}</div>
        <div class="seg full" role="group" aria-label=${e.label}>
          ${e.options.filter(([l])=>a.options.includes(l)).map(([l,n])=>d`<button
                class=${r===l?"on":""}
                aria-pressed=${r===l?"true":"false"}
                ?disabled=${!this._canEdit}
                @click=${()=>this._change(s,{[e.key]:l})}
              >
                ${n}
              </button>`)}
        </div>
        ${e.hint?d`<p class="hint">${e.hint}</p>`:c}
      </div>
    `}_roleContrast(e){return(this._previews[this._variant]?.contrast??[]).filter(a=>W[a.key]?.includes(e.id)).reduce((a,r)=>!a||r.ratio/r.minimum<a.ratio/a.minimum?r:a,void 0)}_renderRole(e,t){let s=q(e,t),a=this._roleColour(e,this._variant),r=this._roleContrast(e),n=(this._previews[this._variant]?.contrast??[]).filter(u=>W[u.key]?.includes(e.id)).every(u=>u.ok),p=this._variant;return d`
      <div class="role">
        <div class="rs" style=${m({background:a||"transparent"})}>
          ${s?d`<input
                  type="color"
                  class="cpick"
                  .value=${(M(a)??"#000000").toLowerCase()}
                  ?disabled=${!this._canEdit}
                  aria-label=${`Pick ${e.label.toLowerCase()} colour`}
                  @input=${u=>this._change([p],pe(e,u.target.value.toUpperCase()),`role-${e.id}-${p}`)}
                /><span class="rs-lock" aria-hidden="true">${h("lock",12)}</span>`:c}
        </div>
        <div class="role-text">
          <div class="rn">${e.label}</div>
          <div class="role-meta">
            <span class="val">${s?"Manual":"Auto"} · ${a||"\u2013"}</span>
            ${r?d`<span class=${n?"badge small":"badge small warn"} title=${`Lowest contrast: ${r.label} (needs ${r.minimum}:1)`}>${r.ratio.toFixed(1)}:1</span>`:c}
          </div>
        </div>
        <div class="mode" role="group" aria-label=${`${e.label} colour mode`}>
          <button class=${s?"":"on"} ?disabled=${!this._canEdit} @click=${()=>s&&this._change([p],he(e))}>Auto</button>
          <button
            class=${s?"on":""}
            ?disabled=${!this._canEdit||!M(a)}
            @click=${()=>{let u=M(a);!s&&u&&this._change([p],pe(e,u))}}
          >
            Manual
          </button>
        </div>
      </div>
    `}_renderMirror(){let e=this._variant==="light"?"Light":"Dark",t=this._variant==="light"?"Dark":"Light";return d`
      <button class="btn" ?disabled=${!this._canEdit} @click=${()=>void this._mirror()}>
        ${h("swap",18)}Make ${t} from ${e}
      </button>
      <p class="hint">
        Copies ${e} to ${t} with the lightness turned around, so the copy stays readable. ${t}-specific
        colours go back to Auto. Undo brings the old ${t} back.
      </p>
    `}_renderCheck(){let e=this._edit?.settings[this._variant],t=this._previews[this._variant];if(!e||!t)return d`<div class="loading">Loading…</div>`;let s=this._previews.light,a=this._previews.dark;return d`
      <div class="sumrow">
        <span class="sumpill">Light · ${s?Fe(s.contrast):"\u2013"}</span>
        <span class="sumpill">Dark · ${a?Fe(a.contrast):"\u2013"}</span>
      </div>
      <div class="roles">
        ${t.contrast.map(r=>{let l=(W[r.key]??[]).map(n=>de.find(p=>p.id===n)).filter(n=>!!(n&&q(n,e)));return d`
            <div class="crow">
              <div class="row-text">
                <div class="rn">${r.label}</div>
                <div class="val">${r.ratio.toFixed(1)}:1 · needs ${r.minimum}:1</div>
                ${!r.ok&&l.length?d`<div class="hint">Manual: ${l.map(n=>n.label).join(", ")}</div>`:c}
              </div>
              ${r.ok?d`<span class="badge">Readable</span>`:l.length&&this._canEdit?d`<button
                      class="btn sm"
                      @click=${()=>{let n=Object.assign({},...l.map(p=>he(p)));this._change([this._variant],n),this._showToast(`${l.map(p=>p.label).join(", ")} set to Auto.`)}}
                    >
                      ${h("wand",16)}Use Auto
                    </button>`:d`<span class="badge warn">Low</span>`}
            </div>
          `})}
      </div>
      <p class="hint">
        Automatic colours are always made readable. Use Auto switches the manual colours of a pair back to automatic;
        Undo brings them back.
      </p>
    `}_renderPreview(){return d`
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
    `}_deviceButton(e,t){let s=this._device===e&&!this._both;return d`<button
      class=${s?"on":""}
      aria-pressed=${s?"true":"false"}
      aria-label=${t}
      title=${t}
      @click=${()=>{this._device=e,this._both=!1}}
    >
      ${h(e,17)}
    </button>`}_renderFrames(){let e=this._both?["light","dark"]:[this._variant],t=this._both?"phone":this._device;return e.map(s=>{let a=this._previews[s];return d`
        <div class="fwrap">
          <div class="flabel">${s==="light"?"Light":"Dark"}</div>
          ${a?d`<div class="frame ${t}" style=${m(ue(a.variables))}>${Oe()}</div>`:d`<div class="frame ${t}"><div class="loading">Loading…</div></div>`}
        </div>
      `})}_renderNewDialog(){let e=this._themes??[],t=e.find(l=>l.slug===this._newSource)?.name??"theme",s=this._backgrounds?.find(l=>l.file===this._newImage),a=this._newMode==="preset"?`My ${t}`:this._newMode==="image"?`From ${(s?.file??"image").replace(/\.[a-z0-9]+$/i,"")}`:"My theme",r=(l,n,p,u)=>d`<button
      class="opt ${this._newMode===l?"on":""}"
      aria-pressed=${this._newMode===l?"true":"false"}
      @click=${()=>this._newMode=l}
    >
      ${h(u,22)}<span class="ot">${n}</span><span class="hint">${p}</span>
    </button>`;return d`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="New theme" @click=${l=>l.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">New theme</h2>
              <p class="sp">You get a light and a dark variant. Everything can be changed afterwards.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${h("close",18)}</button>
          </div>
          <div class="opts">
            ${r("preset","From a theme","Copy a preset or one of your themes.","grid")}
            ${r("colour","From one colour","Pick a base colour; the rest is worked out.","palette")}
            ${r("image","From an image","Colours come from a background image.","image")}
          </div>
          ${this._newMode==="preset"?d`<div class="field">
                <label class="lbl" for="ts-source">Start from</label>
                <select
                  id="ts-source"
                  class="text-input"
                  .value=${this._newSource}
                  @change=${l=>this._newSource=l.target.value}
                >
                  ${e.map(l=>d`<option value=${l.slug} ?selected=${l.slug===this._newSource}>
                      ${l.name}${l.builtin?"":" (mine)"}
                    </option>`)}
                </select>
              </div>`:c}
          ${this._newMode==="colour"?d`<div class="base">
                <label class="swatch-big" style=${m({background:this._newColour})}>
                  <input
                    type="color"
                    class="cpick"
                    .value=${this._newColour.toLowerCase()}
                    aria-label="Pick base colour"
                    @input=${l=>this._newColour=l.target.value.toUpperCase()}
                  />
                </label>
                <div class="field">
                  <span class="lbl">Base colour</span>
                  <span class="val">${this._newColour}</span>
                </div>
              </div>`:c}
          ${this._newMode==="image"?this._backgrounds===void 0?d`<div class="loading">Loading images…</div>`:this._backgrounds.length?d`<div class="images">
                    ${this._backgrounds.map(l=>d`<button
                        class="image ${l.file===this._newImage?"on":""}"
                        aria-pressed=${l.file===this._newImage?"true":"false"}
                        @click=${()=>this._newImage=l.file}
                      >
                        <img src=${l.url} alt="" loading="lazy" /><span>${l.file}</span>
                      </button>`)}
                  </div>`:d`<p class="hint">No images in /config/www/background yet.</p>`:c}
          <div class="field">
            <label class="lbl" for="ts-newname">Name</label>
            <input
              id="ts-newname"
              class="text-input plain"
              maxlength="60"
              .value=${this._newName}
              placeholder=${a}
              @input=${l=>this._newName=l.target.value}
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
    `}_renderUseDialog(){let e=this._edit?.name??"",t=(s,a,r,l)=>d`<button
      class="opt ${this._useScope===s?"on":""}"
      aria-pressed=${this._useScope===s?"true":"false"}
      @click=${()=>this._useScope=s}
    >
      ${h(a,22)}<span class="ot">${r}</span><span class="hint">${l}</span>
    </button>`;return d`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Use theme" @click=${s=>s.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">Use “${e}”</h2>
              <p class="sp">Light and Dark come together. Home Assistant switches between them with the device's dark mode.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${h("close",18)}</button>
          </div>
          <div class="opts two">
            ${t("device","phone","This device","Only the browser or app you are using now.")}
            ${t("everyone","home","Everyone","The default theme for all users and devices.")}
          </div>
          <p class="hint">After more changes, use the theme again to update it everywhere it is used.</p>
          <div class="field">
            <div class="lbl">Share</div>
            <div class="share-row">
              <button class="btn" @click=${()=>void this._export("copy")}>${h("copy",18)}Copy share code</button>
              <button class="btn" @click=${()=>void this._export("download")}>${h("download",18)}Download file</button>
            </div>
            <p class="hint">Others can import the code or file in their Theme Studio. It holds colours and settings only.</p>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${()=>void this._use()}>
              ${this._busy?"Working\u2026":"Use theme"}
            </button>
          </div>
        </div>
      </div>
    `}_renderImportDialog(){return d`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Import a theme" @click=${e=>e.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">Import a theme</h2>
              <p class="sp">Paste a share code (TS1:…) or choose a theme file. It becomes a new theme; nothing is overwritten.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${h("close",18)}</button>
          </div>
          <div class="field">
            <label class="lbl" for="ts-import">Share code or file content</label>
            <textarea
              id="ts-import"
              class="text-input area"
              rows="5"
              spellcheck="false"
              placeholder="TS1:…"
              .value=${this._importText}
              @input=${e=>this._importText=e.target.value}
            ></textarea>
          </div>
          <label class="btn file-btn">
            ${h("upload",18)}Choose file
            <input
              type="file"
              accept=".json,.txt,application/json,text/plain"
              @change=${async e=>{let t=e.target,s=t.files?.[0];t.value="",s&&(this._importText=(await s.text()).slice(0,3e5))}}
            />
          </label>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy||!this._importText.trim()} @click=${()=>void this._import()}>
              Import and open
            </button>
          </div>
        </div>
      </div>
    `}_renderDeleteDialog(){let e=this._edit?.name??"";return d`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="alertdialog" aria-modal="true" aria-label="Delete theme" @click=${t=>t.stopPropagation()}>
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
    `}};N.properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1},_themes:{state:!0},_loading:{state:!0},_error:{state:!0},_filter:{state:!0},_detailError:{state:!0},_variant:{state:!0},_both:{state:!0},_device:{state:!0},_edit:{state:!0},_previews:{state:!0},_probe:{state:!0},_section:{state:!0},_open:{state:!0},_saveState:{state:!0},_saveError:{state:!0},_history:{state:!0},_future:{state:!0},_hexDraft:{state:!0},_dialog:{state:!0},_toast:{state:!0},_busy:{state:!0},_newMode:{state:!0},_newSource:{state:!0},_newColour:{state:!0},_newImage:{state:!0},_newName:{state:!0},_backgrounds:{state:!0},_linked:{state:!0},_useScope:{state:!0},_importText:{state:!0},_inUse:{state:!0},_tiles:{state:!0}},N.styles=[Be,Ve,Ne];customElements.get("theme-studio-panel")||customElements.define("theme-studio-panel",N);export{N as ThemeStudioPanel};
