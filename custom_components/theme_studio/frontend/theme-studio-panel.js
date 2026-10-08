var J=globalThis,Y=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ne=Symbol(),ze=new WeakMap,I=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ne)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(Y&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=ze.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&ze.set(e,r))}return r}toString(){return this.cssText}},Le=n=>new I(typeof n=="string"?n:n+"",void 0,ne),w=(n,...r)=>{let e=n.length===1?n[0]:r.reduce((t,i,o)=>t+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[o+1],n[0]);return new I(e,n,ne)},je=(n,r)=>{if(Y)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=J.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,n.appendChild(t)}},se=Y?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return Le(e)})(n):n;var{is:Mt,defineProperty:Dt,getOwnPropertyDescriptor:Et,getOwnPropertyNames:zt,getOwnPropertySymbols:Lt,getPrototypeOf:jt}=Object,Z=globalThis,Be=Z.trustedTypes,Bt=Be?Be.emptyScript:"",Rt=Z.reactiveElementPolyfillSupport,H=(n,r)=>n,le={toAttribute(n,r){switch(r){case Boolean:n=n?Bt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let e=n;switch(r){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Fe=(n,r)=>!Mt(n,r),Re={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:Fe};Symbol.metadata??=Symbol("metadata"),Z.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&Dt(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:o}=Et(this.prototype,r)??{get(){return this[e]},set(s){this[e]=s}};return{get:i,set(s){let d=i?.call(this);o?.call(this,s),this.requestUpdate(r,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Re}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let r=jt(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let e=this.properties,t=[...zt(e),...Lt(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(se(i))}else r!==void 0&&e.push(se(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return je(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:le).toAttribute(e,t.type);this._$Em=r,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let o=t.getPropertyOptions(i),s=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:le;this._$Em=i;let d=s.fromAttribute(e,o.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(r,e,t,i=!1,o){if(r!==void 0){let s=this.constructor;if(i===!1&&(o=this[r]),t??=s.getPropertyOptions(r),!((t.hasChanged??Fe)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(r)&&!this.hasAttribute(s._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:o},s){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,s??e??this[r]),o!==!0||s!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,o]of t){let{wrapped:s}=o,d=this[i];s!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,o,d)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[H("elementProperties")]=new Map,x[H("finalized")]=new Map,Rt?.({ReactiveElement:x}),(Z.reactiveElementVersions??=[]).push("2.1.2");var ge=globalThis,Ie=n=>n,Q=ge.trustedTypes,He=Q?Q.createPolicy("lit-html",{createHTML:n=>n}):void 0,Oe="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Ue="?"+$,Ft=`<${Ue}>`,D=document,P=()=>D.createComment(""),N=n=>n===null||typeof n!="object"&&typeof n!="function",be=Array.isArray,It=n=>be(n)||typeof n?.[Symbol.iterator]=="function",de=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Pe=/>/g,C=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ne=/'/g,Ve=/"/g,Ge=/^(?:script|style|textarea|title)$/i,fe=n=>(r,...e)=>({_$litType$:n,strings:r,values:e}),l=fe(1),ve=fe(2),$r=fe(3),S=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ke=new WeakMap,M=D.createTreeWalker(D,129);function We(n,r){if(!be(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(r):r}var Ht=(n,r)=>{let e=n.length-1,t=[],i,o=r===2?"<svg>":r===3?"<math>":"",s=q;for(let d=0;d<e;d++){let u=n[d],h,g,m=-1,_=0;for(;_<u.length&&(s.lastIndex=_,g=s.exec(u),g!==null);)_=s.lastIndex,s===q?g[1]==="!--"?s=qe:g[1]!==void 0?s=Pe:g[2]!==void 0?(Ge.test(g[2])&&(i=RegExp("</"+g[2],"g")),s=C):g[3]!==void 0&&(s=C):s===C?g[0]===">"?(s=i??q,m=-1):g[1]===void 0?m=-2:(m=s.lastIndex-g[2].length,h=g[1],s=g[3]===void 0?C:g[3]==='"'?Ve:Ne):s===Ve||s===Ne?s=C:s===qe||s===Pe?s=q:(s=C,i=void 0);let y=s===C&&n[d+1].startsWith("/>")?" ":"";o+=s===q?u+Ft:m>=0?(t.push(h),u.slice(0,m)+Oe+u.slice(m)+$+y):u+$+(m===-2?d:y)}return[We(n,o+(n[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},V=class n{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let o=0,s=0,d=r.length-1,u=this.parts,[h,g]=Ht(r,e);if(this.el=n.createElement(h,t),M.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=M.nextNode())!==null&&u.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Oe)){let _=g[s++],y=i.getAttribute(m).split($),v=/([.?@])?(.*)/.exec(_);u.push({type:1,index:o,name:v[2],strings:y,ctor:v[1]==="."?ce:v[1]==="?"?pe:v[1]==="@"?he:j}),i.removeAttribute(m)}else m.startsWith($)&&(u.push({type:6,index:o}),i.removeAttribute(m));if(Ge.test(i.tagName)){let m=i.textContent.split($),_=m.length-1;if(_>0){i.textContent=Q?Q.emptyScript:"";for(let y=0;y<_;y++)i.append(m[y],P()),M.nextNode(),u.push({type:2,index:++o});i.append(m[_],P())}}}else if(i.nodeType===8)if(i.data===Ue)u.push({type:2,index:o});else{let m=-1;for(;(m=i.data.indexOf($,m+1))!==-1;)u.push({type:7,index:o}),m+=$.length-1}o++}}static createElement(r,e){let t=D.createElement("template");return t.innerHTML=r,t}};function L(n,r,e=n,t){if(r===S)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,o=N(r)?void 0:r._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(n),i._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=L(n,i._$AS(n,r.values),i,t)),r}var ue=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??D).importNode(e,!0);M.currentNode=i;let o=M.nextNode(),s=0,d=0,u=t[0];for(;u!==void 0;){if(s===u.index){let h;u.type===2?h=new K(o,o.nextSibling,this,r):u.type===1?h=new u.ctor(o,u.name,u.strings,this,r):u.type===6&&(h=new me(o,this,r)),this._$AV.push(h),u=t[++d]}s!==u?.index&&(o=M.nextNode(),s++)}return M.currentNode=D,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},K=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=L(this,r,e),N(r)?r===c||r==null||r===""?(this._$AH!==c&&this._$AR(),this._$AH=c):r!==this._$AH&&r!==S&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):It(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==c&&N(this._$AH)?this._$AA.nextSibling.data=r:this.T(D.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=V.createElement(We(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new ue(i,this),s=o.u(this.options);o.p(e),this.T(s),this._$AH=o}}_$AC(r){let e=Ke.get(r.strings);return e===void 0&&Ke.set(r.strings,e=new V(r)),e}k(r){be(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let o of r)i===e.length?e.push(t=new n(this.O(P()),this.O(P()),this,this.options)):t=e[i],t._$AI(o),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=Ie(r).nextSibling;Ie(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},j=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(r,e=this,t,i){let o=this.strings,s=!1;if(o===void 0)r=L(this,r,e,0),s=!N(r)||r!==this._$AH&&r!==S,s&&(this._$AH=r);else{let d=r,u,h;for(r=o[0],u=0;u<o.length-1;u++)h=L(this,d[t+u],e,u),h===S&&(h=this._$AH[u]),s||=!N(h)||h!==this._$AH[u],h===c?r=c:r!==c&&(r+=(h??"")+o[u+1]),this._$AH[u]=h}s&&!i&&this.j(r)}j(r){r===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},ce=class extends j{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===c?void 0:r}},pe=class extends j{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==c)}},he=class extends j{constructor(r,e,t,i,o){super(r,e,t,i,o),this.type=5}_$AI(r,e=this){if((r=L(this,r,e,0)??c)===S)return;let t=this._$AH,i=r===c&&t!==c||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,o=r!==c&&(t===c||i);i&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},me=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){L(this,r)}};var qt=ge.litHtmlPolyfillSupport;qt?.(V,K),(ge.litHtmlVersions??=[]).push("3.3.3");var Je=(n,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let o=e?.renderBefore??null;t._$litPart$=i=new K(r.insertBefore(P(),o),o,void 0,e??{})}return i._$AI(n),i};var _e=globalThis,T=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Je(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};T._$litElement$=!0,T.finalized=!0,_e.litElementHydrateSupport?.({LitElement:T});var Pt=_e.litElementPolyfillSupport;Pt?.({LitElement:T});(_e.litElementVersions??=[]).push("4.2.2");var Ye={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ze=n=>(...r)=>({_$litDirective$:n,values:r}),X=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var Qe="important",Nt=" !"+Qe,b=Ze(class extends X{constructor(n){if(super(n),n.type!==Ye.ATTRIBUTE||n.name!=="style"||n.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(n){return Object.keys(n).reduce((r,e)=>{let t=n[e];return t==null?r:r+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${t};`},"")}update(n,[r]){let{style:e}=n.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(r)),this.render(r);for(let t of this.ft)r[t]==null&&(this.ft.delete(t),t.includes("-")?e.removeProperty(t):e[t]=null);for(let t in r){let i=r[t];if(i!=null){this.ft.add(t);let o=typeof i=="string"&&i.endsWith(Nt);t.includes("-")||o?e.setProperty(t,o?i.slice(0,-11):i,o?Qe:""):e[t]=i}}return S}});var Vt=[["none","None"],["soft_hairline","Hairline"],["glass_edge","Glass edge"],["etched","Etched"],["inner_glow","Inner glow"],["accent_line","Accent line"],["double_line","Double line"],["bevel_edge","Bevel"],["glow_line","Glow line"]],Kt=[["none","None"],["soft_depth","Soft depth"],["glass_glow","Glass glow"],["ambient_lift","Ambient lift"],["neon_glow","Neon glow"],["studio_depth","Studio depth"],["drop_shadow","Drop shadow"],["soft_float","Soft float"],["cinematic_depth","Cinematic"]],Ot=[["none","None"],["soft_veil","Soft veil"],["mesh_glow","Mesh glow"],["vignette","Vignette"],["aurora","Aurora"],["aurora_vertical","Aurora vertical"],["spotlight","Spotlight"],["diagonal_fade","Diagonal fade"],["topographic","Topographic"],["mist","Mist"],["frost","Frost"],["dual_orb","Dual orb"],["soft_stripes","Soft stripes"],["cinematic","Cinematic"],["halo","Halo"]],Xe=[["sans-serif","Sans-serif"],["system-ui","System"],["Roboto","Roboto"],["Inter","Inter"],["Quicksand","Quicksand"],["Iosevka Charon Mono","Iosevka"],["Josefin Sans","Josefin Sans"],["Orbitron","Orbitron"]],et=[{id:"page",label:"Page background",summary:"page",toggle:"use_custom_background_color",colour:"custom_background_color"},{id:"card",label:"Cards",summary:"card",override:"card_bg_override"},{id:"bubble",label:"Bubble cards",summary:"bubble",override:"bubble_bg_override"},{id:"popup",label:"Pop-ups",cssVar:"bubble-pop-up-background-color",override:"popup_bg_override"},{id:"navbar",label:"Navbar",summary:"navbar",override:"navbar_bg_override"},{id:"accent",label:"Accent",summary:"accent",override:"accent_color_override"},{id:"slider",label:"Bubble slider",summary:"slider",override:"bubble_slider_color_override"},{id:"text",label:"Text",summary:"text",toggle:"use_custom_text_color",colour:"custom_text_color"},{id:"secondary",label:"Secondary text",summary:"secondary",override:"secondary_text_color_override"},{id:"icon",label:"Icons",summary:"icon",toggle:"use_custom_icon_color",colour:"custom_icon_color"},{id:"active",label:"Active icons",summary:"active",override:"state_icon_active_color_override"},{id:"navicon",label:"Navbar icons",summary:"nav_icon",toggle:"use_custom_navbar_icon_color",colour:"custom_navbar_icon_color"}],tt=[{id:"headerbg",label:"Header background",cssVar:"app-header-background-color",override:"app_header_background_color_override"},{id:"headertext",label:"Header text",cssVar:"app-header-text-color",override:"app_header_text_color_override"},{id:"secondarybg",label:"Secondary background",cssVar:"secondary-background-color",override:"secondary_background_color_override"},{id:"divider",label:"Dividers",cssVar:"divider-color",override:"divider_color_override"},{id:"sidebaricon",label:"Sidebar icons",cssVar:"sidebar-icon-color",override:"sidebar_icon_color_override"},{id:"disabled",label:"Disabled text",cssVar:"disabled-text-color",override:"disabled_text_color_override"}],ke=[...et,...tt],ee={text_page:["text","page"],text_card:["text","card"],secondary_text_card:["secondary","text","card"],icon_card:["icon","card"],active_icon_card:["active","card"],text_bubble:["text","bubble"],icon_bubble:["icon","bubble"],text_popup:["text","popup"],navbar_icon:["navicon","navbar"],header_text:["headertext","headerbg"],sidebar_icon:["sidebaricon","page"],text_on_accent:["accent"],accent_page:["accent","page"],text_sub_button:["text","bubble"]},O=[{id:"colours",label:"Colours",icon:"palette",description:"Start with one base colour. Everything set to Auto is worked out from it and kept readable.",groups:[{id:"base",title:"Base colour",controls:[{type:"base"}]},{id:"adjust",title:"Adjust",controls:[{type:"slider",key:"contrast",label:"Contrast",ends:["end.soft","end.strong"]},{type:"slider",key:"saturation",label:"Saturation",ends:["end.muted","end.vivid"]},{type:"slider",key:"tone",label:"Tone",ends:["end.darker","end.lighter"]},{type:"slider",key:"hue_shift",label:"Hue shift"},{type:"slider",key:"accent_strength",label:"Accent strength"},{type:"slider",key:"neutrality",label:"Neutral surfaces",ends:["end.tinted","end.neutral"]},{type:"segmented",key:"preview_mode",label:"Style",options:[["Relaxed","Relaxed"],["Focused","Focused"],["Vibrant","Vibrant"]]},{type:"segmented",key:"color_model",label:"Colour model",options:[["hsl","Classic"],["oklch","Even (OKLCH)"]],hint:"Even keeps shades equally bright across colours, so a yellow and a blue theme feel the same."}]},{id:"roles",title:"Colours in use",hint:"Manual colours are never changed by Theme Studio. Tap a manual swatch to pick a colour.",controls:[{type:"roles",roles:et}]},{id:"more",title:"More colours",collapsible:!0,controls:[{type:"roles",roles:tt}]},{id:"finetune",title:"Fine-tune per surface",collapsible:!0,controls:[{type:"slider",key:"surface_lift"},{type:"slider",key:"accent_contrast"},{type:"slider",key:"accent_hue_shift"},{type:"slider",key:"accent_saturation"},{type:"slider",key:"card_bg_contrast"},{type:"slider",key:"card_bg_hue_shift"},{type:"slider",key:"card_bg_saturation"},{type:"slider",key:"bubble_bg_contrast"},{type:"slider",key:"bubble_bg_hue_shift"},{type:"slider",key:"bubble_bg_saturation"},{type:"slider",key:"popup_bg_contrast"},{type:"slider",key:"popup_bg_hue_shift"},{type:"slider",key:"popup_bg_saturation"},{type:"slider",key:"bubble_slider_contrast"},{type:"slider",key:"bubble_slider_hue_shift"},{type:"slider",key:"bubble_slider_saturation"},{type:"slider",key:"bubble_slider_opacity"}]},{id:"mirror",title:"Light and Dark",controls:[{type:"mirror"}]}]},{id:"surfaces",label:"Surfaces",icon:"layers",description:"Shape, glass, borders and shadows of cards, Bubble cards and pop-ups.",linkable:!0,groups:[{id:"shape",title:"Shape",hint:"Chip corners round the small pill buttons (Living room, Kitchen \u2026 in the preview). Home Assistant's own cards do not use it; your own card-mod styles can, through --theme-studio-chip-radius.",controls:[{type:"slider",key:"radius",label:"Card corners",unit:"px"},{type:"slider",key:"chip_radius",label:"Chip corners",unit:"px"}]},{id:"glass",title:"Glass",hint:"Blur shows on see-through cards: lower the opacity first.",controls:[{type:"slider",key:"card_opacity",label:"Card opacity",unit:"%"},{type:"slider",key:"blur_strength",label:"Glass blur",unit:"px"},{type:"slider",key:"bubble_bg_opacity",label:"Bubble card opacity",unit:"%"},{type:"slider",key:"popup_bg_opacity",label:"Pop-up opacity",unit:"%"},{type:"slider",key:"navbar_bg_opacity",label:"Navbar opacity",unit:"%"}]},{id:"border",title:"Border",hint:"The tiles show the border only.",controls:[{type:"tiles",key:"border_type",preview:"border",options:Vt,fixed:{shadow_type:"none"}},{type:"slider",key:"border_size",label:"Border size"},{type:"slider",key:"border_opacity",label:"Border opacity",unit:"%"}]},{id:"border-fine",title:"Border colour",collapsible:!0,controls:[{type:"slider",key:"border_contrast",label:"Contrast"},{type:"slider",key:"border_hue_shift",label:"Hue shift"},{type:"slider",key:"border_saturation",label:"Saturation"}]},{id:"shadow",title:"Shadow",hint:"The tiles show the shadow only.",controls:[{type:"tiles",key:"shadow_type",preview:"shadow",options:Kt,fixed:{border_type:"none"}},{type:"slider",key:"shadow_size",label:"Shadow size"},{type:"slider",key:"shadow_opacity",label:"Shadow opacity",unit:"%"}]},{id:"shadow-fine",title:"Shadow colour",collapsible:!0,controls:[{type:"slider",key:"shadow_contrast",label:"Contrast"},{type:"slider",key:"shadow_hue_shift",label:"Hue shift"},{type:"slider",key:"shadow_saturation",label:"Saturation"}]},{id:"bubble",title:"Bubble Card and pop-ups",controls:[{type:"switch",key:"bubble_use_fx",label:"Border and shadow on Bubble cards"},{type:"switch",key:"popup_use_fx",label:"Border and shadow on pop-ups"}]}]},{id:"background",label:"Background",icon:"image",description:"A plain page colour or an image behind your dashboards. The page colour is under Colours.",linkable:!0,groups:[{id:"image",title:"Image",controls:[{type:"slider",key:"background_contrast",label:"Image visibility",ends:["end.page_colour","end.full_image"]},{type:"images"},{type:"segmented",key:"background_attachment",label:"When you scroll",options:[["fixed","Stays put"],["scroll","Scrolls with the page"]],hint:"Stays put keeps the background still behind the cards. Scrolls with the page moves it up with them."}]},{id:"overlay",title:"Overlay",controls:[{type:"tiles",key:"background_overlay",preview:"overlay",options:Ot},{type:"slider",key:"overlay_contrast",label:"Overlay strength"},{type:"slider",key:"overlay_offset_y",label:"Overlay starts from the top",unit:"%"},{type:"slider",key:"overlay_scale",label:"Overlay size",unit:"%"},{type:"slider",key:"overlay_spread",label:"Overlay spread",unit:"%"}]},{id:"header",title:"Header",controls:[{type:"switch",key:"enable_header_blend",label:"Blend the header into the page"},{type:"slider",key:"header_blend_height",label:"Blend height",unit:"px"}]}]},{id:"type",label:"Type",icon:"type",description:"The font your dashboards use.",linkable:!0,groups:[{id:"font",title:"Font",hint:"Theme Studio loads these fonts in Home Assistant for you; nothing to add as a resource. Orbitron has no \xF8/\xD8 of its own.",controls:[{type:"fonts"}]},{id:"custom-font",title:"Your own font",collapsible:!0,hint:"Put the font file (.woff2, .woff, .ttf or .otf) in /config/www/fonts/ and enter /local/fonts/<file>. Theme Studio loads it for you.",controls:[{type:"switch",key:"use_custom_font",label:"Use my own font"},{type:"text",key:"custom_font_family",label:"Font family name",placeholder:"My Font"},{type:"text",key:"custom_font_path",label:"Font file",placeholder:"/local/fonts/my-font.woff2"}]}]},{id:"check",label:"Check",icon:"contrast",description:"Every text and icon colour against what it sits on.",groups:[]}];function te(n,r){if(n.override){let e=String(r[n.override]??"auto").trim().toLowerCase();return e!==""&&e!=="auto"}if(n.toggle){let e=r[n.toggle];return e===!0||e==="on"}return!1}function ye(n,r){let e=n.override??n.colour;return e?String(r[e]??""):""}function we(n,r){return n.override?{[n.override]:r}:n.toggle&&n.colour?{[n.toggle]:"on",[n.colour]:r}:{}}function xe(n){return n.override?{[n.override]:"auto"}:n.toggle?{[n.toggle]:"off"}:{}}var rt=w`
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
  /* The same phone layout for the dialogs, which sit outside .shell and so
     outside the container query above (the panel sets .narrow). */
  .scrim.narrow {
    align-items: flex-end;
    padding: 0;
  }
  .scrim.narrow .dialog {
    border-radius: 22px 22px 0 0;
    width: 100%;
    max-height: 88vh;
  }
  .scrim.narrow .opts {
    grid-template-columns: minmax(0, 1fr);
  }
  .scrim.narrow .images,
  .scrim.narrow .tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;var at={"common.loading":"Indl\xE6ser\u2026","common.try_again":"Pr\xF8v igen","common.close":"Luk","common.cancel":"Annull\xE9r","error.name_taken":"Navnet bruges allerede af et andet tema.","error.unauthorized":"Kun administratorer kan \xE6ndre temaer.","error.unknown":"ukendt fejl","upload.not_an_image":"Filen er ikke et billede.","upload.unsupported_format":"Brug et PNG-, JPEG-, WebP- eller GIF-billede.","upload.too_large":"Billedet er st\xF8rre end 15 MB.","lib.themes_count":"{count} temaer \xB7 lys og m\xF8rk","lib.tagline":"Temaer til Home Assistant","lib.reload":"Genindl\xE6s temaer","lib.import":"Import\xE9r","lib.import_label":"Import\xE9r et tema","lib.new_theme":"Nyt tema","lib.title":"Dine temaer","lib.sub":"\xC5bn et tema for at \xE6ndre det. Indbyggede presets kopieres f\xF8rste gang, du \xE6ndrer dem, s\xE5 de altid forbliver, som de er.","lib.filter":"Vis","lib.all":"Alle","lib.mine":"Mine","lib.builtin":"Indbyggede","lib.group_mine":"Mine","lib.group_builtin":"Indbyggede presets","lib.load_failed":"Kunne ikke indl\xE6se temaerne","lib.loading":"Indl\xE6ser temaer\u2026","lib.open":"\xC5bn {name}","lib.card_builtin":"Indbygget preset","lib.card_mine":"Mit","lib.to_check":"{count} skal tjekkes","lib.in_use_everyone":"I brug \xB7 alle","lib.in_use_you":"I brug \xB7 dig","status.view_only":"Kun visning \xB7 bed en administrator om at \xE6ndre temaer","status.builtin":"Indbygget preset \xB7 din f\xF8rste \xE6ndring laver en kopi","status.saving":"Gemmer\u2026","status.unsaved":"Ikke-gemte \xE6ndringer","status.error":"Ikke gemt: {error}","status.saved":"Alle \xE6ndringer er gemt","editor.back":"Tilbage til alle temaer","editor.name":"Temaets navn","editor.undo":"Fortryd","editor.redo":"Gentag","editor.variant":"Variant, du redigerer","editor.use":"Brug tema","editor.load_failed":"Kunne ikke indl\xE6se {name}","editor.not_built":"Temaet kunne ikke bygges.","editor.sections":"Sektioner","editor.controls":"Indstillinger","editor.builtin_banner":"Dette er et indbygget preset. \xC6ndrer du noget, laver Theme Studio din egen kopi; selve presettet forbliver ur\xF8rt.","editor.delete":"Slet tema","editor.copy_name":"{name} (kopi)","variant.light":"Lys","variant.dark":"M\xF8rk","link.title":"Ens for Lys og M\xF8rk","link.on":"\xC6ndringer her g\xE6lder begge varianter.","link.off":"\xC6ndringer her g\xE6lder kun {variant}.","section.colours":"Farver","section.colours.description":"Start med \xE9n grundfarve. Alt, der st\xE5r p\xE5 Auto, regnes ud fra den og holdes l\xE6sbart.","section.surfaces":"Flader","section.surfaces.description":"Form, glas, kanter og skygger p\xE5 kort, Bubble-kort og pop-ups.","section.background":"Baggrund","section.background.description":"En ensfarvet side eller et billede bag dine dashboards. Sidefarven ligger under Farver.","section.type":"Skrift","section.type.description":"Skrifttypen dine dashboards bruger.","section.check":"Tjek","section.check.description":"Hver tekst- og ikonfarve m\xE5lt mod det, den st\xE5r p\xE5.","group.base":"Grundfarve","group.adjust":"Just\xE9r","group.roles":"Farver i brug","group.roles.hint":"Manuelle farver \xE6ndres aldrig af Theme Studio. Tryk p\xE5 en manuel farvepr\xF8ve for at v\xE6lge en farve.","group.more":"Flere farver","group.finetune":"Finjust\xE9r hver flade","group.mirror":"Lys og M\xF8rk","group.shape":"Form","group.shape.hint":"Chiphj\xF8rner runder de sm\xE5 pilleformede knapper af (Stue, K\xF8kken \u2026 i forh\xE5ndsvisningen). Home Assistants egne kort bruger det ikke; dine egne card-mod-styles kan bruge det via --theme-studio-chip-radius.","group.glass":"Glas","group.glass.hint":"Sl\xF8ringen ses p\xE5 gennemsigtige kort: s\xE6nk opaciteten f\xF8rst.","group.border":"Kant","group.border.hint":"Felterne viser kun kanten.","group.border-fine":"Kantfarve","group.shadow":"Skygge","group.shadow.hint":"Felterne viser kun skyggen.","group.shadow-fine":"Skyggefarve","group.bubble":"Bubble Card og pop-ups","group.image":"Billede","group.overlay":"Overlay","group.header":"Header","group.font":"Skrifttype","group.font.hint":"Theme Studio indl\xE6ser disse skrifttyper i Home Assistant for dig; du skal ikke tilf\xF8je noget som ressource. Orbitron har ikke sit eget \xF8/\xD8.","group.custom-font":"Din egen skrift","group.custom-font.hint":"L\xE6g skriftfilen (.woff2, .woff, .ttf eller .otf) i /config/www/fonts/, og skriv /local/fonts/<fil>. Theme Studio indl\xE6ser den for dig.","ctl.contrast":"Kontrast","ctl.saturation":"M\xE6tning","ctl.tone":"Tone","ctl.hue_shift":"Farveskift","ctl.accent_strength":"Accentstyrke","ctl.neutrality":"Neutrale flader","ctl.preview_mode":"Stil","ctl.color_model":"Farvemodel","ctl.color_model.hint":"J\xE6vn holder nuancerne lige lyse p\xE5 tv\xE6rs af farver, s\xE5 et gult og et bl\xE5t tema f\xF8les ens.","ctl.surface_lift":"Fladernes lyshed","ctl.accent_contrast":"Accentkontrast","ctl.accent_hue_shift":"Accent-farveskift","ctl.accent_saturation":"Accentm\xE6tning","ctl.card_bg_contrast":"Kortkontrast","ctl.card_bg_hue_shift":"Kort-farveskift","ctl.card_bg_saturation":"Kortm\xE6tning","ctl.bubble_bg_contrast":"Bubble-kontrast","ctl.bubble_bg_hue_shift":"Bubble-farveskift","ctl.bubble_bg_saturation":"Bubble-m\xE6tning","ctl.popup_bg_contrast":"Pop-up-kontrast","ctl.popup_bg_hue_shift":"Pop-up-farveskift","ctl.popup_bg_saturation":"Pop-up-m\xE6tning","ctl.bubble_slider_contrast":"Bubble-slider-kontrast","ctl.bubble_slider_hue_shift":"Bubble-slider-farveskift","ctl.bubble_slider_saturation":"Bubble-slider-m\xE6tning","ctl.bubble_slider_opacity":"Bubble-slider-opacitet","ctl.radius":"Korthj\xF8rner","ctl.chip_radius":"Chiphj\xF8rner","ctl.card_opacity":"Kort-opacitet","ctl.blur_strength":"Glas-sl\xF8ring","ctl.bubble_bg_opacity":"Bubble-opacitet","ctl.popup_bg_opacity":"Pop-up-opacitet","ctl.navbar_bg_opacity":"Navbar-opacitet","ctl.border_size":"Kantst\xF8rrelse","ctl.border_opacity":"Kant-opacitet","ctl.border_contrast":"Kontrast","ctl.border_hue_shift":"Farveskift","ctl.border_saturation":"M\xE6tning","ctl.shadow_size":"Skyggest\xF8rrelse","ctl.shadow_opacity":"Skygge-opacitet","ctl.shadow_contrast":"Kontrast","ctl.shadow_hue_shift":"Farveskift","ctl.shadow_saturation":"M\xE6tning","ctl.bubble_use_fx":"Kant og skygge p\xE5 Bubble-kort","ctl.popup_use_fx":"Kant og skygge p\xE5 pop-ups","ctl.background_contrast":"Billedets synlighed","ctl.background_attachment":"N\xE5r du scroller","ctl.background_attachment.hint":"St\xE5r stille holder baggrunden fast bag kortene. F\xF8lger siden lader den glide op sammen med dem.","ctl.overlay_contrast":"Overlay-styrke","ctl.overlay_offset_y":"Overlay starter fra toppen","ctl.overlay_scale":"Overlay-st\xF8rrelse","ctl.overlay_spread":"Overlay-spredning","ctl.enable_header_blend":"Lad headeren glide over i siden","ctl.header_blend_height":"Overgangens h\xF8jde","ctl.use_custom_font":"Brug min egen skrift","ctl.custom_font_family":"Skriftens navn","ctl.custom_font_path":"Skriftfil","end.soft":"Bl\xF8d","end.strong":"St\xE6rk","end.muted":"D\xE6mpet","end.vivid":"Livlig","end.darker":"M\xF8rkere","end.lighter":"Lysere","end.tinted":"Farvet","end.neutral":"Neutral","end.page_colour":"Sidefarve","end.full_image":"Fuldt billede","opt.Relaxed":"Afslappet","opt.Focused":"Fokuseret","opt.Vibrant":"Livlig","opt.hsl":"Klassisk","opt.oklch":"J\xE6vn (OKLCH)","opt.fixed":"St\xE5r stille","opt.scroll":"F\xF8lger siden","border.none":"Ingen","border.soft_hairline":"H\xE5rlinje","border.glass_edge":"Glaskant","border.etched":"\xC6tset","border.inner_glow":"Indre gl\xF8d","border.accent_line":"Accentlinje","border.double_line":"Dobbeltlinje","border.bevel_edge":"Affaset","border.glow_line":"Gl\xF8delinje","shadow.none":"Ingen","shadow.soft_depth":"Bl\xF8d dybde","shadow.glass_glow":"Glasgl\xF8d","shadow.ambient_lift":"Diffust l\xF8ft","shadow.neon_glow":"Neongl\xF8d","shadow.studio_depth":"Studiedybde","shadow.drop_shadow":"Slagskygge","shadow.soft_float":"Let sv\xE6v","shadow.cinematic_depth":"Filmisk","overlay.none":"Ingen","overlay.soft_veil":"Bl\xF8dt sl\xF8r","overlay.mesh_glow":"Mesh-gl\xF8d","overlay.vignette":"Vignet","overlay.aurora":"Aurora","overlay.aurora_vertical":"Aurora lodret","overlay.spotlight":"Spotlys","overlay.diagonal_fade":"Diagonal toning","overlay.topographic":"Topografisk","overlay.mist":"Dis","overlay.frost":"Frost","overlay.dual_orb":"Dobbelt kugle","overlay.soft_stripes":"Bl\xF8de striber","overlay.cinematic":"Filmisk","overlay.halo":"Halo","font.sans-serif":"Sans-serif","font.system-ui":"System","role.page":"Sidebaggrund","role.card":"Kort","role.bubble":"Bubble-kort","role.popup":"Pop-ups","role.navbar":"Navbar","role.accent":"Accent","role.slider":"Bubble-slider","role.text":"Tekst","role.secondary":"Sekund\xE6r tekst","role.icon":"Ikoner","role.active":"Aktive ikoner","role.navicon":"Navbar-ikoner","role.headerbg":"Header-baggrund","role.headertext":"Header-tekst","role.secondarybg":"Sekund\xE6r baggrund","role.divider":"Skillelinjer","role.sidebaricon":"Sidepanel-ikoner","role.disabled":"Deaktiveret tekst","role.pick":"V\xE6lg en farve til {role}","role.mode":"Farvetilstand for {role}","role.auto":"Auto","role.manual":"Manuel","role.lowest":"Laveste kontrast: {pair} (kr\xE6ver {minimum}:1)","pair.text_page":"Tekst p\xE5 siden","pair.text_card":"Tekst p\xE5 kort","pair.secondary_text_card":"Sekund\xE6r tekst p\xE5 kort","pair.icon_card":"Ikoner p\xE5 kort","pair.active_icon_card":"Aktive ikoner p\xE5 kort","pair.text_bubble":"Tekst p\xE5 Bubble-kort","pair.icon_bubble":"Ikoner p\xE5 Bubble-kort","pair.text_popup":"Tekst i pop-ups","pair.navbar_icon":"Navbar-ikoner","pair.header_text":"Header-tekst","pair.sidebar_icon":"Sidepanel-ikoner","pair.text_on_accent":"Tekst p\xE5 accent (m\xE6rker, chips)","pair.accent_page":"Accent p\xE5 siden","pair.text_sub_button":"Tekst p\xE5 underknapper","base.pick":"V\xE6lg grundfarve","base.hex":"Hex-kode","images.none":"Intet billede","images.upload":"Upload billede","images.uploading":"Uploader\u2026","images.loading":"Indl\xE6ser billeder\u2026","mirror.button":"Lav {target} ud fra {source}","mirror.hint":"Kopierer {source} til {target} med lysheden vendt om, s\xE5 kopien forbliver l\xE6sbar. Farver, der kun er sat for {target}, g\xE5r tilbage til Auto. Fortryd henter den gamle {target} tilbage.","check.light":"Lys \xB7 {summary}","check.dark":"M\xF8rk \xB7 {summary}","check.all_readable":"alle {count} l\xE6sbare","check.some_low":"{failing} af {count} skal tjekkes","check.ratio":"{ratio}:1 \xB7 kr\xE6ver {minimum}:1","check.manual":"Manuel: {roles}","check.readable":"L\xE6sbar","check.use_auto":"Brug Auto","check.low":"Lav","check.hint":"Automatiske farver g\xF8res altid l\xE6sbare. Brug Auto s\xE6tter de manuelle farver i et par tilbage til automatisk; Fortryd henter dem tilbage.","preview.label":"Forh\xE5ndsvisning","preview.both":"Lys + M\xF8rk","preview.size":"St\xF8rrelse","device.phone":"Telefon","device.tablet":"Tablet","device.desktop":"Computer","new.title":"Nyt tema","new.sub":"Du f\xE5r en lys og en m\xF8rk variant. Alt kan \xE6ndres bagefter.","new.preset":"Fra et tema","new.preset_hint":"Kopi\xE9r et preset eller et af dine temaer.","new.colour":"Fra \xE9n farve","new.colour_hint":"V\xE6lg en grundfarve; resten regnes ud.","new.image":"Fra et billede","new.image_hint":"Farverne kommer fra et baggrundsbillede.","new.import_hint":"Inds\xE6t en delingskode, eller v\xE6lg en temafil.","new.start_from":"Start fra","new.mine_option":"{name} (mit)","new.base":"Grundfarve","new.no_images":"Ingen billeder i /config/www/background endnu.","new.name":"Navn","new.placeholder":"Mit tema","new.placeholder_preset":"Mit {name}","new.placeholder_image":"Fra {name}","new.create":"Opret og \xE5bn","use.title":"Brug \u201C{name}\u201D","use.sub":"Lys og M\xF8rk f\xF8lges ad. Home Assistant skifter mellem dem efter enhedens m\xF8rke tilstand.","use.me":"Kun mig","use.me_hint":"Din profil, p\xE5 alle dine enheder. Andre beholder deres tema.","use.everyone":"Alle","use.everyone_hint":"Standardtemaet. Du f\xF8lger det ogs\xE5; personer, der har valgt deres eget tema i deres profil, beholder det.","use.again":"N\xE5r du har lavet flere \xE6ndringer, skal du bruge temaet igen for at opdatere det alle steder, hvor det er i brug.","use.share":"Del","use.copy":"Kopi\xE9r delingskode","use.download":"Hent fil","use.share_hint":"Andre kan importere koden eller filen i deres Theme Studio. Den indeholder kun farver og indstillinger.","use.working":"Arbejder\u2026","import.title":"Import\xE9r et tema","import.sub":"Inds\xE6t en delingskode (TS1:\u2026), eller v\xE6lg en temafil. Den bliver til et nyt tema; intet overskrives.","import.field":"Delingskode eller filindhold","import.file":"V\xE6lg fil","import.button":"Import\xE9r og \xE5bn","delete.title":"Slet \u201C{name}\u201D?","delete.sub":"Temaet og dets temafil fjernes fra Home Assistant. En sikkerhedskopi af temaet bliver liggende i /config/theme_studio/user_themes.","delete.button":"Slet","toast.preview_failed":"Forh\xE5ndsvisningen mislykkedes: {error}","toast.forked":"Indbyggede presets forbliver, som de er. Dine \xE6ndringer gemmes i \u201C{name}\u201D.","toast.used_everyone":"\u201C{name}\u201D er nu temaet for alle.","toast.used_you":"\u201C{name}\u201D er nu dit tema.","toast.use_failed":"Kunne ikke bruge temaet: {error}","toast.share_copied":"Delingskoden er kopieret. Inds\xE6t den under Import\xE9r i et andet Theme Studio.","toast.share_blocked":"Kopiering er blokeret her; delingskoden ligger under Import\xE9r p\xE5 startsiden.","toast.downloaded":"{file} er hentet.","toast.share_failed":"Kunne ikke dele: {error}","toast.imported":"\u201C{name}\u201D er importeret.","toast.imported_renamed":"Importeret som \u201C{name}\u201D, fordi navnet var optaget.","toast.import_invalid":"Det er ikke en delingskode eller temafil fra Theme Studio.","toast.import_failed":"Kunne ikke importere: {error}","toast.deleted":"\u201C{name}\u201D er slettet. En sikkerhedskopi bliver liggende i mappen user_themes.","toast.delete_failed":"Kunne ikke slette: {error}","toast.mirrored":"{target} er nu en kopi af {source}. Fortryd henter den gamle tilbage.","toast.mirror_failed":"Kunne ikke kopiere: {error}","toast.created":"\u201C{name}\u201D er oprettet med en lys og en m\xF8rk variant.","toast.create_failed":"Kunne ikke oprette temaet: {error}","toast.upload_unsupported":"Upload kr\xE6ver en nyere Home Assistant-frontend.","toast.uploaded":"{file} er uploadet og i brug.","toast.upload_failed":"Kunne ikke uploade: {error}","toast.set_auto":"{roles} er sat til Auto.","mock.home":"Hjem","mock.sub":"Onsdag \xB7 14\xB0 ude","mock.living_room":"Stue","mock.kitchen":"K\xF8kken","mock.bedroom":"Sovev\xE6relse","mock.garden":"Have","mock.ceiling":"Loftslampe","mock.on_percent":"T\xE6ndt \xB7 70 %","mock.floor_lamp":"Gulvlampe","mock.off":"Slukket","mock.dining_table":"Spisebord","mock.heating_to":"Varmer op til 22\xB0","mock.playlist":"Aftenplayliste","mock.speaker":"K\xF8kkenh\xF8jttaler","mock.front_door":"Hovedd\xF8r","mock.locked":"L\xE5st \xB7 for 2 min. siden","mock.away":"Ude-tilstand","tour.help":"Hj\xE6lp","tour.welcome.title":"Velkommen til Theme Studio","tour.welcome.body":"Theme Studio laver komplette temaer til Home Assistant, lyse og m\xF8rke, ud fra \xE9n farve. Hvordan vil du i gang?","tour.quick":"Hurtig start","tour.quick.meta":"{count} trin \xB7 1 minut","tour.quick.desc":"Lav og brug dit f\xF8rste tema.","tour.full":"Alle funktioner","tour.full.meta":"{count} trin \xB7 ca. 5 minutter","tour.full.desc":"En rundtur i hver knap og indstilling.","tour.language":"Sprog","tour.language.note":"Sproget f\xF8lger din Home Assistant. Du kan ogs\xE5 v\xE6lge det her \u2013 det g\xE6lder hele Theme Studio.","tour.skip_all":"Spring guiden over","tour.help_later":"Du finder den altid under ?","tour.skip":"Spring over","tour.back":"Tilbage","tour.next":"N\xE6ste","tour.done":"F\xE6rdig","tour.step_of":"Trin {n} af {total}","tour.see_all":"Se alle funktioner","tour.hint":"Guiden ligger her, n\xE5r du f\xE5r brug for den igen.","tour.got_it":"Forst\xE5et","tour.chapter.quick":"Hurtig start","tour.chapter.overview":"Oversigt","tour.chapter.top":"Topbj\xE6lke","tour.chapter.colours":"Farver","tour.chapter.surfaces":"Flader","tour.chapter.background":"Baggrund","tour.chapter.type":"Skrift","tour.chapter.check":"Tjek","tour.chapter.preview":"Forh\xE5ndsvisning","tour.chapter.finish":"Afslutning","tour.q.new.title":"Lav dit f\xF8rste tema","tour.q.new.body":"Tryk p\xE5 Nyt tema. Start fra et preset, en enkelt farve eller et billede \u2013 Theme Studio regner resten ud.","tour.q.base.title":"V\xE6lg grundfarven","tour.q.base.body":"Denne ene farve styrer hele temaet. Alt p\xE5 Auto f\xF8lger den og holdes l\xE6sbart.","tour.q.variant.title":"Lys og M\xF8rk","tour.q.variant.body":"Skift mellem de to varianter her. De gemmes hver for sig, s\xE5 Lys aldrig overskriver M\xF8rk.","tour.q.check.title":"Tjek l\xE6sbarheden","tour.q.check.body":"St\xE5r der et tal p\xE5 Tjek, er noget tekst eller et ikon sv\xE6rt at l\xE6se. \xC5bn det, og tryk Brug Auto for at rette det.","tour.q.preview.title":"Se det live","tour.q.preview.body":"Forh\xE5ndsvisningen opdateres, mens du \xE6ndrer. Pr\xF8v telefon, tablet og computer \u2013 eller Lys og M\xF8rk side om side.","tour.q.use.title":"Tag temaet i brug","tour.q.use.body":"Tryk Brug tema. Kun mig s\xE6tter det i din egen profil; Alle g\xF8r det til standardtema for hele hjemmet.","tour.q.end.title":"S\xE5dan!","tour.q.end.body":"Dit tema gemmes automatisk. Vil du se alt, hvad Theme Studio kan? Tag den fulde rundtur \u2013 eller kom tilbage til den senere med ?.","tour.f.cards.title":"Dine temaer","tour.f.cards.body":"Hvert kort viser den lyse og den m\xF8rke variant side om side. Et m\xE6rke fort\xE6ller, om temaet er i brug, eller om noget skal tjekkes for kontrast.","tour.f.filter.title":"Filtr\xE9r listen","tour.f.filter.body":"Vis alle temaer, kun dine egne eller kun de indbyggede presets.","tour.f.new.title":"Nyt tema","tour.f.new.body":"Tre m\xE5der at starte p\xE5: kopi\xE9r et preset eller et af dine temaer, v\xE6lg \xE9n farve, eller tag farverne fra et baggrundsbillede.","tour.f.import.title":"Import\xE9r","tour.f.import.body":"Inds\xE6t en delingskode (TS1:\u2026) eller v\xE6lg en temafil, du har f\xE5et. Det bliver altid et nyt tema \u2013 intet overskrives.","tour.f.reload.title":"Genindl\xE6s","tour.f.reload.body":"L\xE6ser temafilerne igen, f.eks. hvis du selv har kopieret en temafil ind i /config.","tour.f.name.title":"Navn og gemning","tour.f.name.body":"Tryk p\xE5 navnet for at omd\xF8be temaet. Linjen nedenunder viser, om alt er gemt \u2013 det sker et \xF8jeblik efter hver \xE6ndring.","tour.f.undo.title":"Fortryd og Gentag","tour.f.undo.body":"G\xE5 tilbage og frem gennem dine \xE6ndringer, ogs\xE5 efter du har skiftet sektion.","tour.f.variant.title":"Lys og M\xF8rk","tour.f.variant.body":"V\xE6lg hvilken variant du redigerer. De to gemmes hver for sig.","tour.f.use.title":"Brug og del","tour.f.use.body":"Brug tema s\xE6tter det for Kun mig eller for Alle. I samme vindue kan du kopiere en delingskode eller hente temafilen.","tour.f.base.title":"Grundfarve","tour.f.base.body":"Tryk p\xE5 farvefeltet for at v\xE6lge en farve, eller skriv en hex-kode. Alle automatiske farver regnes ud fra den.","tour.f.adjust.title":"Just\xE9r","tour.f.adjust.body":"Kontrast, m\xE6tning, tone, farveskift, accentstyrke og neutrale flader finjusterer hele paletten p\xE5 \xE9n gang.","tour.f.style.title":"Stil og farvemodel","tour.f.style.body":"Stil s\xE6tter den overordnede stemning. J\xE6vn (OKLCH) holder nuancerne lige lyse p\xE5 tv\xE6rs af farver, s\xE5 et gult og et bl\xE5t tema f\xF8les ens.","tour.f.roles.title":"Farver i brug","tour.f.roles.body":"Hver farve st\xE5r p\xE5 Auto eller Manuel. V\xE6lg Manuel for selv at bestemme farven \u2013 Theme Studio \xE6ndrer aldrig en manuel farve.","tour.f.more.title":"Flere farver og finjustering","tour.f.more.body":"\xC5bn dem for at s\xE6tte farver p\xE5 header, skillelinjer og sidepanel, eller for at justere hver flade \u2013 kort, Bubble-kort og pop-ups \u2013 for sig.","tour.f.mirror.title":"Lav M\xF8rk ud fra Lys","tour.f.mirror.body":"Kopierer den variant, du st\xE5r i, til den anden med lysheden vendt om, s\xE5 den forbliver l\xE6sbar. Fortryd henter den gamle tilbage.","tour.f.link.title":"Ens for Lys og M\xF8rk","tour.f.link.body":"Sl\xE5et til i Flader, Baggrund og Skrift g\xE6lder \xE9n \xE6ndring begge varianter. Sl\xE5et fra \xE6ndrer du kun den, du st\xE5r i.","tour.f.shape.title":"Form og glas","tour.f.shape.body":"Rund hj\xF8rnerne p\xE5 kort og chips af, og g\xF8r kortene gennemsigtige med glas-sl\xF8ring. S\xE6nk opaciteten f\xF8rst for at se sl\xF8ringen.","tour.f.border.title":"Kanter","tour.f.border.body":"V\xE6lg en kantstil blandt felterne \u2013 de viser kun kanten \u2013 og s\xE6t st\xF8rrelse og opacitet. Kantfarven ligger nedenunder.","tour.f.shadow.title":"Skygger","tour.f.shadow.body":"V\xE6lg en skygge blandt felterne \u2013 de viser kun skyggen \u2013 og s\xE6t st\xF8rrelse og opacitet. Skyggefarven ligger nedenunder.","tour.f.bubble.title":"Bubble Card og pop-ups","tour.f.bubble.body":"V\xE6lg om Bubble-kort og pop-ups f\xE5r samme kant og skygge som dine andre kort.","tour.f.image.title":"Baggrundsbillede","tour.f.image.body":"V\xE6lg et billede fra /config/www/background, eller upload dit eget. Billedets synlighed glider mellem sidefarven og det fulde billede.","tour.f.overlay.title":"Overlay","tour.f.overlay.body":"L\xE6g et m\xF8nster eller en lyseffekt over baggrunden, og s\xE6t styrke, start, st\xF8rrelse og spredning.","tour.f.header.title":"Header-overgang","tour.f.header.body":"Lader toppen af siden glide over i baggrunden, s\xE5 headeren smelter sammen med den. H\xF8jden bestemmer, hvor langt ned det g\xE5r.","tour.f.scroll.title":"N\xE5r du scroller","tour.f.scroll.body":"St\xE5r stille holder baggrunden fast bag kortene. F\xF8lger siden lader den glide op sammen med dem.","tour.f.fonts.title":"Skrifttyper","tour.f.fonts.body":"V\xE6lg skrifttypen til dine dashboards. Theme Studio indl\xE6ser skrifterne i Home Assistant for dig \u2013 intet at installere.","tour.f.ownfont.title":"Din egen skrift","tour.f.ownfont.body":"L\xE6g en skriftfil i /config/www/fonts/, sl\xE5 Brug min egen skrift til, og skriv navn og sti.","tour.f.check.title":"Kontrasttjek","tour.f.check.body":"Al tekst og alle ikoner m\xE5les mod det, de st\xE5r p\xE5. Brug Auto s\xE6tter de manuelle farver i et svagt par tilbage til automatisk.","tour.f.preview.title":"Forh\xE5ndsvisning","tour.f.preview.body":"Se temaet p\xE5 telefon, tablet eller computer \u2013 eller Lys og M\xF8rk side om side. Den opdateres, mens du arbejder.","tour.f.delete.title":"Slet et tema","tour.f.delete.body":"P\xE5 dine egne temaer ligger Slet tema nederst i hver sektion. Der gemmes en sikkerhedskopi, og indbyggede presets kan ikke slettes.","tour.f.end.title":"Nu kender du det hele","tour.f.end.body":"Det var alle funktioner. Start rundturen igen n\xE5r som helst med ?, eller v\xE6lg Hurtig start for den korte udgave."};var it={"common.loading":"Wird geladen\u2026","common.try_again":"Erneut versuchen","common.close":"Schlie\xDFen","common.cancel":"Abbrechen","error.name_taken":"Dieser Name wird schon von einem anderen Theme verwendet.","error.unauthorized":"Nur Administratoren k\xF6nnen Themes \xE4ndern.","error.unknown":"unbekannter Fehler","upload.not_an_image":"Diese Datei ist kein Bild.","upload.unsupported_format":"Verwende ein PNG-, JPEG-, WebP- oder GIF-Bild.","upload.too_large":"Das Bild ist gr\xF6\xDFer als 15 MB.","lib.themes_count":"{count} Themes \xB7 hell und dunkel","lib.tagline":"Themes f\xFCr Home Assistant","lib.reload":"Themes neu laden","lib.import":"Importieren","lib.import_label":"Theme importieren","lib.new_theme":"Neues Theme","lib.title":"Deine Themes","lib.sub":"\xD6ffne ein Theme, um es zu \xE4ndern. Eingebaute Vorlagen werden beim ersten \xC4ndern kopiert, damit sie immer so bleiben, wie sie sind.","lib.filter":"Anzeigen","lib.all":"Alle","lib.mine":"Meine","lib.builtin":"Eingebaut","lib.group_mine":"Meine","lib.group_builtin":"Eingebaute Vorlagen","lib.load_failed":"Die Themes konnten nicht geladen werden","lib.loading":"Themes werden geladen\u2026","lib.open":"{name} \xF6ffnen","lib.card_builtin":"Eingebaute Vorlage","lib.card_mine":"Meins","lib.to_check":"{count} pr\xFCfen","lib.in_use_everyone":"Verwendet \xB7 alle","lib.in_use_you":"Verwendet \xB7 du","status.view_only":"Nur ansehen \xB7 bitte einen Administrator, Themes zu \xE4ndern","status.builtin":"Eingebaute Vorlage \xB7 deine erste \xC4nderung erstellt eine Kopie","status.saving":"Wird gespeichert\u2026","status.unsaved":"Ungespeicherte \xC4nderungen","status.error":"Nicht gespeichert: {error}","status.saved":"Alle \xC4nderungen gespeichert","editor.back":"Zur\xFCck zu allen Themes","editor.name":"Name des Themes","editor.undo":"R\xFCckg\xE4ngig","editor.redo":"Wiederholen","editor.variant":"Variante","editor.use":"Theme verwenden","editor.load_failed":"{name} konnte nicht geladen werden","editor.not_built":"Dieses Theme konnte nicht erstellt werden.","editor.sections":"Bereiche","editor.controls":"Einstellungen","editor.builtin_banner":"Das ist eine eingebaute Vorlage. Sobald du etwas \xE4nderst, erstellt Theme Studio deine eigene Kopie; die Vorlage selbst bleibt unver\xE4ndert.","editor.delete":"Theme l\xF6schen","editor.copy_name":"{name} (Kopie)","variant.light":"Hell","variant.dark":"Dunkel","link.title":"Gleich f\xFCr Hell und Dunkel","link.on":"\xC4nderungen hier gelten f\xFCr beide Varianten.","link.off":"\xC4nderungen hier gelten nur f\xFCr {variant}.","section.colours":"Farben","section.colours.description":"Beginne mit einer Grundfarbe. Alles, was auf Auto steht, wird daraus berechnet und bleibt gut lesbar.","section.surfaces":"Fl\xE4chen","section.surfaces.description":"Form, Glas, Rahmen und Schatten von Karten, Bubble-Karten und Pop-ups.","section.background":"Hintergrund","section.background.description":"Eine einfarbige Seite oder ein Bild hinter deinen Dashboards. Die Seitenfarbe findest du unter Farben.","section.type":"Schrift","section.type.description":"Die Schrift deiner Dashboards.","section.check":"Pr\xFCfen","section.check.description":"Jeder Text und jedes Symbol gegen seinen Hintergrund gemessen.","group.base":"Grundfarbe","group.adjust":"Anpassen","group.roles":"Verwendete Farben","group.roles.hint":"Manuelle Farben \xE4ndert Theme Studio nie. Tippe auf ein manuelles Farbfeld, um eine Farbe zu w\xE4hlen.","group.more":"Weitere Farben","group.finetune":"Jede Fl\xE4che feinabstimmen","group.mirror":"Hell und Dunkel","group.shape":"Form","group.shape.hint":"Chipecken runden die kleinen Pillen-Schaltfl\xE4chen (Wohnzimmer, K\xFCche \u2026 in der Vorschau). Die Karten von Home Assistant selbst nutzen sie nicht; deine eigenen card-mod-Stile k\xF6nnen sie \xFCber --theme-studio-chip-radius nutzen.","group.glass":"Glas","group.glass.hint":"Die Unsch\xE4rfe zeigt sich auf durchscheinenden Karten: Senke zuerst die Deckkraft.","group.border":"Rahmen","group.border.hint":"Die Kacheln zeigen nur den Rahmen.","group.border-fine":"Rahmenfarbe","group.shadow":"Schatten","group.shadow.hint":"Die Kacheln zeigen nur den Schatten.","group.shadow-fine":"Schattenfarbe","group.bubble":"Bubble Card und Pop-ups","group.image":"Bild","group.overlay":"Overlay","group.header":"Kopfzeile","group.font":"Schrift","group.font.hint":"Theme Studio l\xE4dt diese Schriften in Home Assistant f\xFCr dich; du musst nichts als Ressource hinzuf\xFCgen. Orbitron hat kein eigenes \xF8/\xD8.","group.custom-font":"Eigene Schrift","group.custom-font.hint":"Lege die Schriftdatei (.woff2, .woff, .ttf oder .otf) in /config/www/fonts/ und gib /local/fonts/<Datei> ein. Theme Studio l\xE4dt sie f\xFCr dich.","ctl.contrast":"Kontrast","ctl.saturation":"S\xE4ttigung","ctl.tone":"Helligkeit","ctl.hue_shift":"Farbtonverschiebung","ctl.accent_strength":"Akzentst\xE4rke","ctl.neutrality":"Neutrale Fl\xE4chen","ctl.preview_mode":"Stil","ctl.color_model":"Farbmodell","ctl.color_model.hint":"Gleichm\xE4\xDFig h\xE4lt Farbt\xF6ne \xFCber alle Farben gleich hell, sodass sich ein gelbes und ein blaues Theme gleich anf\xFChlen.","ctl.surface_lift":"Helligkeit der Fl\xE4chen","ctl.accent_contrast":"Akzentkontrast","ctl.accent_hue_shift":"Akzent-Farbtonverschiebung","ctl.accent_saturation":"Akzents\xE4ttigung","ctl.card_bg_contrast":"Kartenkontrast","ctl.card_bg_hue_shift":"Karten-Farbtonverschiebung","ctl.card_bg_saturation":"Kartens\xE4ttigung","ctl.bubble_bg_contrast":"Bubble-Kontrast","ctl.bubble_bg_hue_shift":"Bubble-Farbtonverschiebung","ctl.bubble_bg_saturation":"Bubble-S\xE4ttigung","ctl.popup_bg_contrast":"Pop-up-Kontrast","ctl.popup_bg_hue_shift":"Pop-up-Farbtonverschiebung","ctl.popup_bg_saturation":"Pop-up-S\xE4ttigung","ctl.bubble_slider_contrast":"Bubble-Slider-Kontrast","ctl.bubble_slider_hue_shift":"Bubble-Slider-Farbtonverschiebung","ctl.bubble_slider_saturation":"Bubble-Slider-S\xE4ttigung","ctl.bubble_slider_opacity":"Bubble-Slider-Deckkraft","ctl.radius":"Kartenecken","ctl.chip_radius":"Chipecken","ctl.card_opacity":"Kartendeckkraft","ctl.blur_strength":"Glasunsch\xE4rfe","ctl.bubble_bg_opacity":"Bubble-Deckkraft","ctl.popup_bg_opacity":"Pop-up-Deckkraft","ctl.navbar_bg_opacity":"Deckkraft der Navigationsleiste","ctl.border_size":"Rahmenst\xE4rke","ctl.border_opacity":"Rahmendeckkraft","ctl.border_contrast":"Kontrast","ctl.border_hue_shift":"Farbtonverschiebung","ctl.border_saturation":"S\xE4ttigung","ctl.shadow_size":"Schattengr\xF6\xDFe","ctl.shadow_opacity":"Schattendeckkraft","ctl.shadow_contrast":"Kontrast","ctl.shadow_hue_shift":"Farbtonverschiebung","ctl.shadow_saturation":"S\xE4ttigung","ctl.bubble_use_fx":"Rahmen und Schatten auf Bubble-Karten","ctl.popup_use_fx":"Rahmen und Schatten auf Pop-ups","ctl.background_contrast":"Bildsichtbarkeit","ctl.background_attachment":"Beim Scrollen","ctl.background_attachment.hint":"Bleibt stehen h\xE4lt den Hintergrund fest hinter den Karten. Scrollt mit l\xE4sst ihn mit ihnen nach oben gleiten.","ctl.overlay_contrast":"Overlay-St\xE4rke","ctl.overlay_offset_y":"Overlay beginnt oben bei","ctl.overlay_scale":"Overlay-Gr\xF6\xDFe","ctl.overlay_spread":"Overlay-Streuung","ctl.enable_header_blend":"Kopfzeile in die Seite \xFCbergehen lassen","ctl.header_blend_height":"\xDCbergangsh\xF6he","ctl.use_custom_font":"Eigene Schrift verwenden","ctl.custom_font_family":"Name der Schrift","ctl.custom_font_path":"Schriftdatei","end.soft":"Weich","end.strong":"Stark","end.muted":"Ged\xE4mpft","end.vivid":"Kr\xE4ftig","end.darker":"Dunkler","end.lighter":"Heller","end.tinted":"Get\xF6nt","end.neutral":"Neutral","end.page_colour":"Seitenfarbe","end.full_image":"Volles Bild","opt.Relaxed":"Entspannt","opt.Focused":"Fokussiert","opt.Vibrant":"Lebendig","opt.hsl":"Klassisch","opt.oklch":"Gleichm\xE4\xDFig (OKLCH)","opt.fixed":"Bleibt stehen","opt.scroll":"Scrollt mit","border.none":"Ohne","border.soft_hairline":"Haarlinie","border.glass_edge":"Glaskante","border.etched":"Ge\xE4tzt","border.inner_glow":"Inneres Leuchten","border.accent_line":"Akzentlinie","border.double_line":"Doppellinie","border.bevel_edge":"Abgeschr\xE4gt","border.glow_line":"Leuchtlinie","shadow.none":"Ohne","shadow.soft_depth":"Sanfte Tiefe","shadow.glass_glow":"Glasgl\xFChen","shadow.ambient_lift":"Leichtes Abheben","shadow.neon_glow":"Neongl\xFChen","shadow.studio_depth":"Studiotiefe","shadow.drop_shadow":"Schlagschatten","shadow.soft_float":"Sanftes Schweben","shadow.cinematic_depth":"Filmisch","overlay.none":"Ohne","overlay.soft_veil":"Sanfter Schleier","overlay.mesh_glow":"Mesh-Leuchten","overlay.vignette":"Vignette","overlay.aurora":"Aurora","overlay.aurora_vertical":"Aurora vertikal","overlay.spotlight":"Spotlight","overlay.diagonal_fade":"Diagonaler Verlauf","overlay.topographic":"Topografisch","overlay.mist":"Nebel","overlay.frost":"Frost","overlay.dual_orb":"Zwei Lichtkugeln","overlay.soft_stripes":"Sanfte Streifen","overlay.cinematic":"Filmisch","overlay.halo":"Halo","font.sans-serif":"Serifenlos","font.system-ui":"System","role.page":"Seitenhintergrund","role.card":"Karten","role.bubble":"Bubble-Karten","role.popup":"Pop-ups","role.navbar":"Navigationsleiste","role.accent":"Akzent","role.slider":"Bubble-Slider","role.text":"Text","role.secondary":"Zweittext","role.icon":"Symbole","role.active":"Aktive Symbole","role.navicon":"Symbole der Navigationsleiste","role.headerbg":"Kopfzeilenhintergrund","role.headertext":"Kopfzeilentext","role.secondarybg":"Zweithintergrund","role.divider":"Trennlinien","role.sidebaricon":"Symbole der Seitenleiste","role.disabled":"Deaktivierter Text","role.pick":"Farbe f\xFCr {role} w\xE4hlen","role.mode":"Farbmodus f\xFCr {role}","role.auto":"Auto","role.manual":"Manuell","role.lowest":"Geringster Kontrast: {pair} (braucht {minimum}:1)","pair.text_page":"Text auf der Seite","pair.text_card":"Text auf Karten","pair.secondary_text_card":"Zweittext auf Karten","pair.icon_card":"Symbole auf Karten","pair.active_icon_card":"Aktive Symbole auf Karten","pair.text_bubble":"Text auf Bubble-Karten","pair.icon_bubble":"Symbole auf Bubble-Karten","pair.text_popup":"Text in Pop-ups","pair.navbar_icon":"Symbole der Navigationsleiste","pair.header_text":"Kopfzeilentext","pair.sidebar_icon":"Symbole der Seitenleiste","pair.text_on_accent":"Text auf Akzent (Abzeichen, Chips)","pair.accent_page":"Akzent auf der Seite","pair.text_sub_button":"Text auf Unterschaltfl\xE4chen","base.pick":"Grundfarbe w\xE4hlen","base.hex":"Hex-Code","images.none":"Kein Bild","images.upload":"Bild hochladen","images.uploading":"Wird hochgeladen\u2026","images.loading":"Bilder werden geladen\u2026","mirror.button":"{target} aus {source} erstellen","mirror.hint":"Kopiert {source} mit umgekehrter Helligkeit nach {target}, damit die Kopie lesbar bleibt. Farben, die nur f\xFCr {target} gesetzt sind, gehen zur\xFCck auf Auto. R\xFCckg\xE4ngig holt das alte {target} zur\xFCck.","check.light":"Hell \xB7 {summary}","check.dark":"Dunkel \xB7 {summary}","check.all_readable":"alle {count} lesbar","check.some_low":"{failing} von {count} pr\xFCfen","check.ratio":"{ratio}:1 \xB7 braucht {minimum}:1","check.manual":"Manuell: {roles}","check.readable":"Lesbar","check.use_auto":"Auto verwenden","check.low":"Niedrig","check.hint":"Automatische Farben werden immer lesbar gemacht. Auto verwenden stellt die manuellen Farben eines Paars wieder auf automatisch; R\xFCckg\xE4ngig holt sie zur\xFCck.","preview.label":"Vorschau","preview.both":"Hell + Dunkel","preview.size":"Gr\xF6\xDFe","device.phone":"Handy","device.tablet":"Tablet","device.desktop":"Computer","new.title":"Neues Theme","new.sub":"Du bekommst eine helle und eine dunkle Variante. Alles l\xE4sst sich danach noch \xE4ndern.","new.preset":"Aus einem Theme","new.preset_hint":"Kopiere eine Vorlage oder eines deiner Themes.","new.colour":"Aus einer Farbe","new.colour_hint":"W\xE4hle eine Grundfarbe; der Rest wird berechnet.","new.image":"Aus einem Bild","new.image_hint":"Die Farben kommen aus einem Hintergrundbild.","new.import_hint":"F\xFCge einen Teilen-Code ein oder w\xE4hle eine Theme-Datei.","new.start_from":"Ausgangspunkt","new.mine_option":"{name} (meins)","new.base":"Grundfarbe","new.no_images":"Noch keine Bilder in /config/www/background.","new.name":"Name","new.placeholder":"Mein Theme","new.placeholder_preset":"Mein {name}","new.placeholder_image":"Aus {name}","new.create":"Erstellen und \xF6ffnen","use.title":"\u201E{name}\u201C verwenden","use.sub":"Hell und Dunkel geh\xF6ren zusammen. Home Assistant wechselt mit dem Dunkelmodus des Ger\xE4ts zwischen ihnen.","use.me":"Nur ich","use.me_hint":"Dein Profil, auf all deinen Ger\xE4ten. Andere behalten ihr Theme.","use.everyone":"Alle","use.everyone_hint":"Das Standard-Theme. Du folgst ihm auch; wer in seinem Profil ein eigenes Theme gew\xE4hlt hat, beh\xE4lt es.","use.again":"Verwende das Theme nach weiteren \xC4nderungen erneut, um es \xFCberall zu aktualisieren, wo es verwendet wird.","use.share":"Teilen","use.copy":"Teilen-Code kopieren","use.download":"Datei herunterladen","use.share_hint":"Andere k\xF6nnen den Code oder die Datei in ihrem Theme Studio importieren. Beides enth\xE4lt nur Farben und Einstellungen.","use.working":"Wird ausgef\xFChrt\u2026","import.title":"Theme importieren","import.sub":"F\xFCge einen Teilen-Code (TS1:\u2026) ein oder w\xE4hle eine Theme-Datei. Daraus wird ein neues Theme; nichts wird \xFCberschrieben.","import.field":"Teilen-Code oder Dateiinhalt","import.file":"Datei w\xE4hlen","import.button":"Importieren und \xF6ffnen","delete.title":"\u201E{name}\u201C l\xF6schen?","delete.sub":"Das Theme und seine Theme-Datei werden aus Home Assistant entfernt. Eine Sicherungskopie des Themes bleibt in /config/theme_studio/user_themes.","delete.button":"L\xF6schen","toast.preview_failed":"Vorschau fehlgeschlagen: {error}","toast.forked":"Eingebaute Vorlagen bleiben, wie sie sind. Deine \xC4nderungen werden in \u201E{name}\u201C gespeichert.","toast.used_everyone":"\u201E{name}\u201C ist jetzt das Theme f\xFCr alle.","toast.used_you":"\u201E{name}\u201C ist jetzt dein Theme.","toast.use_failed":"Das Theme konnte nicht verwendet werden: {error}","toast.share_copied":"Teilen-Code kopiert. F\xFCge ihn in einem anderen Theme Studio unter Importieren ein.","toast.share_blocked":"Kopieren ist hier blockiert; der Teilen-Code steht unter Importieren auf der Startseite.","toast.downloaded":"{file} wurde heruntergeladen.","toast.share_failed":"Teilen fehlgeschlagen: {error}","toast.imported":"\u201E{name}\u201C wurde importiert.","toast.imported_renamed":"Als \u201E{name}\u201C importiert, weil der Name schon vergeben war.","toast.import_invalid":"Das ist weder ein Teilen-Code noch eine Theme-Datei von Theme Studio.","toast.import_failed":"Import fehlgeschlagen: {error}","toast.deleted":"\u201E{name}\u201C wurde gel\xF6scht. Eine Sicherungskopie bleibt im Ordner user_themes.","toast.delete_failed":"L\xF6schen fehlgeschlagen: {error}","toast.mirrored":"{target} ist jetzt eine Kopie von {source}. R\xFCckg\xE4ngig holt die alte Variante zur\xFCck.","toast.mirror_failed":"Kopieren fehlgeschlagen: {error}","toast.created":"\u201E{name}\u201C wurde mit einer hellen und einer dunklen Variante erstellt.","toast.create_failed":"Das Theme konnte nicht erstellt werden: {error}","toast.upload_unsupported":"Zum Hochladen ist ein neueres Home Assistant-Frontend n\xF6tig.","toast.uploaded":"{file} wurde hochgeladen und wird verwendet.","toast.upload_failed":"Hochladen fehlgeschlagen: {error}","toast.set_auto":"{roles} auf Auto gestellt.","mock.home":"Zuhause","mock.sub":"Mittwoch \xB7 14\xB0 drau\xDFen","mock.living_room":"Wohnzimmer","mock.kitchen":"K\xFCche","mock.bedroom":"Schlafzimmer","mock.garden":"Garten","mock.ceiling":"Deckenlicht","mock.on_percent":"An \xB7 70 %","mock.floor_lamp":"Stehlampe","mock.off":"Aus","mock.dining_table":"Esstisch","mock.heating_to":"Heizt auf 22\xB0","mock.playlist":"Abend-Playlist","mock.speaker":"K\xFCchenlautsprecher","mock.front_door":"Haust\xFCr","mock.locked":"Verriegelt \xB7 vor 2 Min.","mock.away":"Abwesenheitsmodus","tour.help":"Hilfe","tour.welcome.title":"Willkommen bei Theme Studio","tour.welcome.body":"Theme Studio erstellt vollst\xE4ndige Themes f\xFCr Home Assistant, hell und dunkel, aus einer einzigen Farbe. Wie m\xF6chtest du starten?","tour.quick":"Schnellstart","tour.quick.meta":"{count} Schritte \xB7 1 Minute","tour.quick.desc":"Erstelle und verwende dein erstes Theme.","tour.full":"Alle Funktionen","tour.full.meta":"{count} Schritte \xB7 ca. 5 Minuten","tour.full.desc":"Ein Rundgang durch jede Schaltfl\xE4che und Einstellung.","tour.language":"Sprache","tour.language.note":"Die Sprache folgt deinem Home Assistant. Du kannst sie auch hier w\xE4hlen \u2013 sie gilt f\xFCr ganz Theme Studio.","tour.skip_all":"Rundgang \xFCberspringen","tour.help_later":"Du findest ihn immer unter ?","tour.skip":"\xDCberspringen","tour.back":"Zur\xFCck","tour.next":"Weiter","tour.done":"Fertig","tour.step_of":"Schritt {n} von {total}","tour.see_all":"Alle Funktionen ansehen","tour.hint":"Hier findest du den Rundgang, wann immer du ihn wieder brauchst.","tour.got_it":"Verstanden","tour.chapter.quick":"Schnellstart","tour.chapter.overview":"\xDCbersicht","tour.chapter.top":"Obere Leiste","tour.chapter.colours":"Farben","tour.chapter.surfaces":"Fl\xE4chen","tour.chapter.background":"Hintergrund","tour.chapter.type":"Schrift","tour.chapter.check":"Pr\xFCfen","tour.chapter.preview":"Vorschau","tour.chapter.finish":"Abschluss","tour.q.new.title":"Dein erstes Theme","tour.q.new.body":"Tippe auf Neues Theme. Starte mit einer Vorlage, einer einzelnen Farbe oder einem Foto \u2013 den Rest berechnet Theme Studio.","tour.q.base.title":"Grundfarbe w\xE4hlen","tour.q.base.body":"Diese eine Farbe bestimmt das ganze Theme. Alles auf Auto folgt ihr und bleibt gut lesbar.","tour.q.variant.title":"Hell und Dunkel","tour.q.variant.body":"Hier wechselst du zwischen den beiden Varianten. Sie werden getrennt gespeichert, Hell \xFCberschreibt also nie Dunkel.","tour.q.check.title":"Lesbarkeit pr\xFCfen","tour.q.check.body":"Steht bei Pr\xFCfen eine Zahl, ist ein Text oder Symbol schwer lesbar. \xD6ffne es und tippe auf Auto verwenden, um es zu beheben.","tour.q.preview.title":"Live ansehen","tour.q.preview.body":"Die Vorschau aktualisiert sich beim \xC4ndern. Probiere Handy, Tablet und Computer \u2013 oder Hell und Dunkel nebeneinander.","tour.q.use.title":"Theme verwenden","tour.q.use.body":"Tippe auf Theme verwenden. Nur ich setzt es in deinem eigenen Profil; Alle macht es zum Standard-Theme f\xFCr das ganze Zuhause.","tour.q.end.title":"Geschafft!","tour.q.end.body":"Dein Theme wird automatisch gespeichert. Willst du alles sehen, was Theme Studio kann? Mach den ganzen Rundgang \u2013 oder sp\xE4ter \xFCber ?.","tour.f.cards.title":"Deine Themes","tour.f.cards.body":"Jede Karte zeigt die helle und die dunkle Variante nebeneinander. Ein Abzeichen zeigt, ob ein Theme verwendet wird oder ob der Kontrast gepr\xFCft werden sollte.","tour.f.filter.title":"Liste filtern","tour.f.filter.body":"Zeige alle Themes, nur deine eigenen oder nur die eingebauten Vorlagen.","tour.f.new.title":"Neues Theme","tour.f.new.body":"Drei Wege zum Start: eine Vorlage oder eines deiner Themes kopieren, eine Farbe w\xE4hlen oder die Farben aus einem Hintergrundbild \xFCbernehmen.","tour.f.import.title":"Importieren","tour.f.import.body":"F\xFCge einen Teilen-Code (TS1:\u2026) ein oder w\xE4hle eine Theme-Datei, die du bekommen hast. Es entsteht immer ein neues Theme \u2013 nichts wird \xFCberschrieben.","tour.f.reload.title":"Neu laden","tour.f.reload.body":"Liest die Theme-Dateien neu ein, zum Beispiel nachdem du selbst eine Theme-Datei nach /config kopiert hast.","tour.f.name.title":"Name und Speichern","tour.f.name.body":"Tippe auf den Namen, um das Theme umzubenennen. Die Zeile darunter zeigt den Speicherstand \u2013 gespeichert wird kurz nach jeder \xC4nderung.","tour.f.undo.title":"R\xFCckg\xE4ngig und Wiederholen","tour.f.undo.body":"Gehe durch deine \xC4nderungen zur\xFCck und vor, auch nachdem du den Bereich gewechselt hast.","tour.f.variant.title":"Hell und Dunkel","tour.f.variant.body":"W\xE4hle, welche Variante du bearbeitest. Beide werden getrennt gespeichert.","tour.f.use.title":"Verwenden und teilen","tour.f.use.body":"Theme verwenden setzt es f\xFCr Nur ich oder f\xFCr Alle. Im selben Fenster kannst du einen Teilen-Code kopieren oder die Theme-Datei herunterladen.","tour.f.base.title":"Grundfarbe","tour.f.base.body":"Tippe auf das Farbfeld, um eine Farbe zu w\xE4hlen, oder gib einen Hex-Code ein. Alle automatischen Farben werden daraus berechnet.","tour.f.adjust.title":"Anpassen","tour.f.adjust.body":"Kontrast, S\xE4ttigung, Helligkeit, Farbtonverschiebung, Akzentst\xE4rke und neutrale Fl\xE4chen stimmen die ganze Palette auf einmal ab.","tour.f.style.title":"Stil und Farbmodell","tour.f.style.body":"Der Stil bestimmt die Grundstimmung. Gleichm\xE4\xDFig (OKLCH) h\xE4lt Farbt\xF6ne \xFCber alle Farben gleich hell, sodass sich ein gelbes und ein blaues Theme gleich anf\xFChlen.","tour.f.roles.title":"Verwendete Farben","tour.f.roles.body":"Jede Farbe steht auf Auto oder Manuell. W\xE4hle Manuell, um sie selbst festzulegen \u2013 eine manuelle Farbe \xE4ndert Theme Studio nie.","tour.f.more.title":"Weitere Farben und Feinabstimmung","tour.f.more.body":"\xD6ffne sie, um Kopfzeile, Trennlinien und Seitenleiste einzuf\xE4rben oder jede Fl\xE4che \u2013 Karten, Bubble-Karten, Pop-ups \u2013 einzeln anzupassen.","tour.f.mirror.title":"Dunkel aus Hell erstellen","tour.f.mirror.body":"Kopiert die aktuelle Variante mit umgekehrter Helligkeit in die andere, damit sie lesbar bleibt. R\xFCckg\xE4ngig holt die alte zur\xFCck.","tour.f.link.title":"Gleich f\xFCr Hell und Dunkel","tour.f.link.body":"Eingeschaltet in Fl\xE4chen, Hintergrund und Schrift gilt eine \xC4nderung f\xFCr beide Varianten. Ausgeschaltet \xE4nderst du nur die aktuelle.","tour.f.shape.title":"Form und Glas","tour.f.shape.body":"Runde die Ecken von Karten und Chips ab und mache Karten mit Glasunsch\xE4rfe durchscheinend. Senke zuerst die Deckkraft, um die Unsch\xE4rfe zu sehen.","tour.f.border.title":"Rahmen","tour.f.border.body":"W\xE4hle einen Rahmenstil aus den Kacheln \u2013 sie zeigen nur den Rahmen \u2013 und stelle St\xE4rke und Deckkraft ein. Die Rahmenfarbe liegt darunter.","tour.f.shadow.title":"Schatten","tour.f.shadow.body":"W\xE4hle einen Schatten aus den Kacheln \u2013 sie zeigen nur den Schatten \u2013 und stelle Gr\xF6\xDFe und Deckkraft ein. Die Schattenfarbe liegt darunter.","tour.f.bubble.title":"Bubble Card und Pop-ups","tour.f.bubble.body":"Lege fest, ob Bubble-Karten und Pop-ups denselben Rahmen und Schatten wie deine anderen Karten bekommen.","tour.f.image.title":"Hintergrundbild","tour.f.image.body":"W\xE4hle ein Bild aus /config/www/background oder lade dein eigenes hoch. Die Bildsichtbarkeit blendet zwischen Seitenfarbe und vollem Bild.","tour.f.overlay.title":"Overlay","tour.f.overlay.body":"Lege ein Muster oder einen Lichteffekt \xFCber den Hintergrund und stelle St\xE4rke, Start, Gr\xF6\xDFe und Streuung ein.","tour.f.header.title":"\xDCbergang der Kopfzeile","tour.f.header.body":"L\xE4sst den oberen Seitenrand in den Hintergrund \xFCbergehen, sodass die Kopfzeile mit ihm verschmilzt. Die \xDCbergangsh\xF6he bestimmt, wie weit es nach unten reicht.","tour.f.scroll.title":"Beim Scrollen","tour.f.scroll.body":"Bleibt stehen h\xE4lt den Hintergrund fest hinter den Karten. Scrollt mit l\xE4sst ihn mit ihnen nach oben gleiten.","tour.f.fonts.title":"Schriften","tour.f.fonts.body":"W\xE4hle die Schrift f\xFCr deine Dashboards. Theme Studio l\xE4dt die Schriften in Home Assistant f\xFCr dich \u2013 nichts zu installieren.","tour.f.ownfont.title":"Eigene Schrift","tour.f.ownfont.body":"Lege eine Schriftdatei in /config/www/fonts/, schalte Eigene Schrift verwenden ein und gib Name und Pfad ein.","tour.f.check.title":"Kontrastpr\xFCfung","tour.f.check.body":"Jeder Text und jedes Symbol wird gegen seinen Hintergrund gemessen. Auto verwenden stellt die manuellen Farben eines schwachen Paars wieder auf automatisch.","tour.f.preview.title":"Vorschau","tour.f.preview.body":"Sieh dein Theme auf Handy, Tablet oder Computer \u2013 oder Hell und Dunkel nebeneinander. Sie aktualisiert sich, w\xE4hrend du arbeitest.","tour.f.delete.title":"Theme l\xF6schen","tour.f.delete.body":"Bei deinen eigenen Themes steht Theme l\xF6schen unten in jedem Bereich. Eine Sicherungskopie bleibt erhalten, eingebaute Vorlagen lassen sich nicht l\xF6schen.","tour.f.end.title":"Jetzt kennst du alles","tour.f.end.body":"Das waren alle Funktionen. Starte den Rundgang jederzeit neu mit ? oder w\xE4hle Schnellstart f\xFCr die kurze Version."};var ot={"common.loading":"Loading\u2026","common.try_again":"Try again","common.close":"Close","common.cancel":"Cancel","error.name_taken":"That name is already used by another theme.","error.unauthorized":"Only administrators can change themes.","error.unknown":"unknown error","upload.not_an_image":"That file is not an image.","upload.unsupported_format":"Use a PNG, JPEG, WebP or GIF image.","upload.too_large":"The image is larger than 15 MB.","lib.themes_count":"{count} themes \xB7 light and dark","lib.tagline":"Themes for Home Assistant","lib.reload":"Reload themes","lib.import":"Import","lib.import_label":"Import a theme","lib.new_theme":"New theme","lib.title":"Your themes","lib.sub":"Open a theme to change it. Built-in presets are copied the first time you change them, so they always stay as they are.","lib.filter":"Show","lib.all":"All","lib.mine":"Mine","lib.builtin":"Built-in","lib.group_mine":"Mine","lib.group_builtin":"Built-in presets","lib.load_failed":"Could not load the themes","lib.loading":"Loading themes\u2026","lib.open":"Open {name}","lib.card_builtin":"Built-in preset","lib.card_mine":"Mine","lib.to_check":"{count} to check","lib.in_use_everyone":"In use \xB7 everyone","lib.in_use_you":"In use \xB7 you","status.view_only":"View only \xB7 ask an administrator to change themes","status.builtin":"Built-in preset \xB7 your first change makes a copy","status.saving":"Saving\u2026","status.unsaved":"Unsaved changes","status.error":"Not saved: {error}","status.saved":"All changes saved","editor.back":"Back to all themes","editor.name":"Theme name","editor.undo":"Undo","editor.redo":"Redo","editor.variant":"Variant to edit","editor.use":"Use theme","editor.load_failed":"Could not load {name}","editor.not_built":"This theme could not be built.","editor.sections":"Sections","editor.controls":"Controls","editor.builtin_banner":"This is a built-in preset. Change anything and Theme Studio makes your own copy; the preset itself stays untouched.","editor.delete":"Delete theme","editor.copy_name":"{name} (copy)","variant.light":"Light","variant.dark":"Dark","link.title":"Same for Light and Dark","link.on":"Changes here apply to both variants.","link.off":"Changes here only apply to {variant}.","section.colours":"Colours","section.colours.description":"Start with one base colour. Everything set to Auto is worked out from it and kept readable.","section.surfaces":"Surfaces","section.surfaces.description":"Shape, glass, borders and shadows of cards, Bubble cards and pop-ups.","section.background":"Background","section.background.description":"A plain page colour or an image behind your dashboards. The page colour is under Colours.","section.type":"Type","section.type.description":"The font your dashboards use.","section.check":"Check","section.check.description":"Every text and icon colour against what it sits on.","group.base":"Base colour","group.adjust":"Adjust","group.roles":"Colours in use","group.roles.hint":"Manual colours are never changed by Theme Studio. Tap a manual swatch to pick a colour.","group.more":"More colours","group.finetune":"Fine-tune per surface","group.mirror":"Light and Dark","group.shape":"Shape","group.shape.hint":"Chip corners round the small pill buttons (Living room, Kitchen \u2026 in the preview). Home Assistant's own cards do not use it; your own card-mod styles can, through --theme-studio-chip-radius.","group.glass":"Glass","group.glass.hint":"Blur shows on see-through cards: lower the opacity first.","group.border":"Border","group.border.hint":"The tiles show the border only.","group.border-fine":"Border colour","group.shadow":"Shadow","group.shadow.hint":"The tiles show the shadow only.","group.shadow-fine":"Shadow colour","group.bubble":"Bubble Card and pop-ups","group.image":"Image","group.overlay":"Overlay","group.header":"Header","group.font":"Font","group.font.hint":"Theme Studio loads these fonts in Home Assistant for you; nothing to add as a resource. Orbitron has no \xF8/\xD8 of its own.","group.custom-font":"Your own font","group.custom-font.hint":"Put the font file (.woff2, .woff, .ttf or .otf) in /config/www/fonts/ and enter /local/fonts/<file>. Theme Studio loads it for you.","ctl.contrast":"Contrast","ctl.saturation":"Saturation","ctl.tone":"Tone","ctl.hue_shift":"Hue shift","ctl.accent_strength":"Accent strength","ctl.neutrality":"Neutral surfaces","ctl.preview_mode":"Style","ctl.color_model":"Colour model","ctl.color_model.hint":"Even keeps shades equally bright across colours, so a yellow and a blue theme feel the same.","ctl.surface_lift":"Surface lift","ctl.accent_contrast":"Accent contrast","ctl.accent_hue_shift":"Accent hue shift","ctl.accent_saturation":"Accent saturation","ctl.card_bg_contrast":"Card contrast","ctl.card_bg_hue_shift":"Card hue shift","ctl.card_bg_saturation":"Card saturation","ctl.bubble_bg_contrast":"Bubble card contrast","ctl.bubble_bg_hue_shift":"Bubble card hue shift","ctl.bubble_bg_saturation":"Bubble card saturation","ctl.popup_bg_contrast":"Pop-up contrast","ctl.popup_bg_hue_shift":"Pop-up hue shift","ctl.popup_bg_saturation":"Pop-up saturation","ctl.bubble_slider_contrast":"Bubble slider contrast","ctl.bubble_slider_hue_shift":"Bubble slider hue shift","ctl.bubble_slider_saturation":"Bubble slider saturation","ctl.bubble_slider_opacity":"Bubble slider opacity","ctl.radius":"Card corners","ctl.chip_radius":"Chip corners","ctl.card_opacity":"Card opacity","ctl.blur_strength":"Glass blur","ctl.bubble_bg_opacity":"Bubble card opacity","ctl.popup_bg_opacity":"Pop-up opacity","ctl.navbar_bg_opacity":"Navbar opacity","ctl.border_size":"Border size","ctl.border_opacity":"Border opacity","ctl.border_contrast":"Contrast","ctl.border_hue_shift":"Hue shift","ctl.border_saturation":"Saturation","ctl.shadow_size":"Shadow size","ctl.shadow_opacity":"Shadow opacity","ctl.shadow_contrast":"Contrast","ctl.shadow_hue_shift":"Hue shift","ctl.shadow_saturation":"Saturation","ctl.bubble_use_fx":"Border and shadow on Bubble cards","ctl.popup_use_fx":"Border and shadow on pop-ups","ctl.background_contrast":"Image visibility","ctl.background_attachment":"When you scroll","ctl.background_attachment.hint":"Stays put keeps the background still behind the cards. Scrolls with the page moves it up with them.","ctl.overlay_contrast":"Overlay strength","ctl.overlay_offset_y":"Overlay starts from the top","ctl.overlay_scale":"Overlay size","ctl.overlay_spread":"Overlay spread","ctl.enable_header_blend":"Blend the header into the page","ctl.header_blend_height":"Blend height","ctl.use_custom_font":"Use my own font","ctl.custom_font_family":"Font family name","ctl.custom_font_path":"Font file","end.soft":"Soft","end.strong":"Strong","end.muted":"Muted","end.vivid":"Vivid","end.darker":"Darker","end.lighter":"Lighter","end.tinted":"Tinted","end.neutral":"Neutral","end.page_colour":"Page colour","end.full_image":"Full image","opt.Relaxed":"Relaxed","opt.Focused":"Focused","opt.Vibrant":"Vibrant","opt.hsl":"Classic","opt.oklch":"Even (OKLCH)","opt.fixed":"Stays put","opt.scroll":"Scrolls with the page","border.none":"None","border.soft_hairline":"Hairline","border.glass_edge":"Glass edge","border.etched":"Etched","border.inner_glow":"Inner glow","border.accent_line":"Accent line","border.double_line":"Double line","border.bevel_edge":"Bevel","border.glow_line":"Glow line","shadow.none":"None","shadow.soft_depth":"Soft depth","shadow.glass_glow":"Glass glow","shadow.ambient_lift":"Ambient lift","shadow.neon_glow":"Neon glow","shadow.studio_depth":"Studio depth","shadow.drop_shadow":"Drop shadow","shadow.soft_float":"Soft float","shadow.cinematic_depth":"Cinematic","overlay.none":"None","overlay.soft_veil":"Soft veil","overlay.mesh_glow":"Mesh glow","overlay.vignette":"Vignette","overlay.aurora":"Aurora","overlay.aurora_vertical":"Aurora vertical","overlay.spotlight":"Spotlight","overlay.diagonal_fade":"Diagonal fade","overlay.topographic":"Topographic","overlay.mist":"Mist","overlay.frost":"Frost","overlay.dual_orb":"Dual orb","overlay.soft_stripes":"Soft stripes","overlay.cinematic":"Cinematic","overlay.halo":"Halo","font.sans-serif":"Sans-serif","font.system-ui":"System","role.page":"Page background","role.card":"Cards","role.bubble":"Bubble cards","role.popup":"Pop-ups","role.navbar":"Navbar","role.accent":"Accent","role.slider":"Bubble slider","role.text":"Text","role.secondary":"Secondary text","role.icon":"Icons","role.active":"Active icons","role.navicon":"Navbar icons","role.headerbg":"Header background","role.headertext":"Header text","role.secondarybg":"Secondary background","role.divider":"Dividers","role.sidebaricon":"Sidebar icons","role.disabled":"Disabled text","role.pick":"Pick a colour for {role}","role.mode":"Colour mode for {role}","role.auto":"Auto","role.manual":"Manual","role.lowest":"Lowest contrast: {pair} (needs {minimum}:1)","pair.text_page":"Text on page","pair.text_card":"Text on cards","pair.secondary_text_card":"Secondary text on cards","pair.icon_card":"Icons on cards","pair.active_icon_card":"Active icons on cards","pair.text_bubble":"Text on Bubble cards","pair.icon_bubble":"Icons on Bubble cards","pair.text_popup":"Text in pop-ups","pair.navbar_icon":"Navbar icons","pair.header_text":"Header text","pair.sidebar_icon":"Sidebar icons","pair.text_on_accent":"Text on accent (badges, chips)","pair.accent_page":"Accent on page","pair.text_sub_button":"Text on sub-buttons","base.pick":"Pick base colour","base.hex":"Hex code","images.none":"No image","images.upload":"Upload image","images.uploading":"Uploading\u2026","images.loading":"Loading images\u2026","mirror.button":"Make {target} from {source}","mirror.hint":"Copies {source} to {target} with the lightness turned around, so the copy stays readable. Colours set only for {target} go back to Auto. Undo brings the old {target} back.","check.light":"Light \xB7 {summary}","check.dark":"Dark \xB7 {summary}","check.all_readable":"all {count} readable","check.some_low":"{failing} of {count} to check","check.ratio":"{ratio}:1 \xB7 needs {minimum}:1","check.manual":"Manual: {roles}","check.readable":"Readable","check.use_auto":"Use Auto","check.low":"Low","check.hint":"Automatic colours are always made readable. Use Auto switches the manual colours of a pair back to automatic; Undo brings them back.","preview.label":"Preview","preview.both":"Light + Dark","preview.size":"Preview size","device.phone":"Phone","device.tablet":"Tablet","device.desktop":"Computer","new.title":"New theme","new.sub":"You get a light and a dark variant. Everything can be changed afterwards.","new.preset":"From a theme","new.preset_hint":"Copy a preset or one of your themes.","new.colour":"From one colour","new.colour_hint":"Pick a base colour; the rest is worked out.","new.image":"From an image","new.image_hint":"Colours come from a background image.","new.import_hint":"Paste a share code or choose a theme file.","new.start_from":"Start from","new.mine_option":"{name} (mine)","new.base":"Base colour","new.no_images":"No images in /config/www/background yet.","new.name":"Name","new.placeholder":"My theme","new.placeholder_preset":"My {name}","new.placeholder_image":"From {name}","new.create":"Create and open","use.title":"Use \u201C{name}\u201D","use.sub":"Light and Dark come together. Home Assistant switches between them with the device's dark mode.","use.me":"Just me","use.me_hint":"Your profile, on all your devices. Others keep their theme.","use.everyone":"Everyone","use.everyone_hint":"The default theme. You follow it too; people who picked their own theme in their profile keep it.","use.again":"After more changes, use the theme again to update it everywhere it is used.","use.share":"Share","use.copy":"Copy share code","use.download":"Download file","use.share_hint":"Others can import the code or file in their Theme Studio. It holds colours and settings only.","use.working":"Working\u2026","import.title":"Import a theme","import.sub":"Paste a share code (TS1:\u2026) or choose a theme file. It becomes a new theme; nothing is overwritten.","import.field":"Share code or file content","import.file":"Choose file","import.button":"Import and open","delete.title":"Delete \u201C{name}\u201D?","delete.sub":"The theme and its theme file are removed from Home Assistant. A backup copy of the theme stays in /config/theme_studio/user_themes.","delete.button":"Delete","toast.preview_failed":"Preview failed: {error}","toast.forked":"Built-in presets stay as they are. Your changes are saved in \u201C{name}\u201D.","toast.used_everyone":"\u201C{name}\u201D is now the theme for everyone.","toast.used_you":"\u201C{name}\u201D is now your theme.","toast.use_failed":"Could not use the theme: {error}","toast.share_copied":"Share code copied. Paste it into Import in another Theme Studio.","toast.share_blocked":"Copying is blocked here; the share code is in Import on the start page.","toast.downloaded":"{file} is downloaded.","toast.share_failed":"Could not share: {error}","toast.imported":"\u201C{name}\u201D is imported.","toast.imported_renamed":"Imported as \u201C{name}\u201D, because the name was taken.","toast.import_invalid":"That is not a Theme Studio share code or theme file.","toast.import_failed":"Could not import: {error}","toast.deleted":"\u201C{name}\u201D is deleted. A backup copy stays in the user_themes folder.","toast.delete_failed":"Could not delete: {error}","toast.mirrored":"{target} is now a copy of {source}. Undo brings the old one back.","toast.mirror_failed":"Could not copy: {error}","toast.created":"\u201C{name}\u201D is created with a light and a dark variant.","toast.create_failed":"Could not create the theme: {error}","toast.upload_unsupported":"Uploading needs a newer Home Assistant frontend.","toast.uploaded":"{file} is uploaded and in use.","toast.upload_failed":"Could not upload: {error}","toast.set_auto":"{roles} set to Auto.","mock.home":"Home","mock.sub":"Wednesday \xB7 14\xB0 outside","mock.living_room":"Living room","mock.kitchen":"Kitchen","mock.bedroom":"Bedroom","mock.garden":"Garden","mock.ceiling":"Ceiling","mock.on_percent":"On \xB7 70 %","mock.floor_lamp":"Floor lamp","mock.off":"Off","mock.dining_table":"Dining table","mock.heating_to":"Heating to 22\xB0","mock.playlist":"Evening playlist","mock.speaker":"Kitchen speaker","mock.front_door":"Front door","mock.locked":"Locked \xB7 2 min ago","mock.away":"Away mode","tour.help":"Help","tour.welcome.title":"Welcome to Theme Studio","tour.welcome.body":"Theme Studio makes complete Home Assistant themes, light and dark, from one colour. How would you like to start?","tour.quick":"Quick start","tour.quick.meta":"{count} steps \xB7 1 minute","tour.quick.desc":"Make and use your first theme.","tour.full":"All functions","tour.full.meta":"{count} steps \xB7 about 5 minutes","tour.full.desc":"A tour of every button and setting.","tour.language":"Language","tour.language.note":"The language follows your Home Assistant. You can also pick it here \u2013 it applies to all of Theme Studio.","tour.skip_all":"Skip the guide","tour.help_later":"It is always under ?","tour.skip":"Skip","tour.back":"Back","tour.next":"Next","tour.done":"Done","tour.step_of":"Step {n} of {total}","tour.see_all":"See all functions","tour.hint":"The guide is here whenever you need it again.","tour.got_it":"Got it","tour.chapter.quick":"Quick start","tour.chapter.overview":"Overview","tour.chapter.top":"Top bar","tour.chapter.colours":"Colours","tour.chapter.surfaces":"Surfaces","tour.chapter.background":"Background","tour.chapter.type":"Type","tour.chapter.check":"Check","tour.chapter.preview":"Preview","tour.chapter.finish":"Wrapping up","tour.q.new.title":"Make your first theme","tour.q.new.body":"Tap New theme. Start from a preset, from one colour or from a photo \u2013 Theme Studio works out the rest.","tour.q.base.title":"Pick the base colour","tour.q.base.body":"This one colour drives the whole theme. Everything on Auto follows it and stays readable.","tour.q.variant.title":"Light and Dark","tour.q.variant.body":"Switch between the two variants here. Each is saved on its own, so Light never overwrites Dark.","tour.q.check.title":"Check readability","tour.q.check.body":"A number on Check means some text or icon is hard to read. Open it and tap Use Auto to fix it.","tour.q.preview.title":"See it live","tour.q.preview.body":"The preview updates as you change things. Try phone, tablet and computer \u2013 or Light and Dark side by side.","tour.q.use.title":"Use your theme","tour.q.use.body":"Tap Use theme. Just me sets it in your own profile; Everyone makes it the default theme for the whole home.","tour.q.end.title":"That's it!","tour.q.end.body":"Your theme is saved automatically. Want to see everything Theme Studio can do? Take the full tour \u2013 or come back to it later with ?.","tour.f.cards.title":"Your themes","tour.f.cards.body":"Each card shows the light and dark variant side by side. A badge tells you if a theme is in use, or if something needs a contrast check.","tour.f.filter.title":"Filter the list","tour.f.filter.body":"Show all themes, only your own, or only the built-in presets.","tour.f.new.title":"New theme","tour.f.new.body":"Three ways to start: copy a preset or one of your themes, pick one colour, or take the colours from a background image.","tour.f.import.title":"Import","tour.f.import.body":"Paste a share code (TS1:\u2026) or choose a theme file you got from someone. It always becomes a new theme \u2013 nothing is overwritten.","tour.f.reload.title":"Reload","tour.f.reload.body":"Reads the theme files again, for example after you copied a theme file into /config by hand.","tour.f.name.title":"Name and saving","tour.f.name.body":"Tap the name to rename the theme. The line below shows the save status \u2013 everything is saved a moment after you change it.","tour.f.undo.title":"Undo and Redo","tour.f.undo.body":"Step back and forward through your changes, also after switching sections.","tour.f.variant.title":"Light and Dark","tour.f.variant.body":"Choose which variant you are editing. The two are stored separately.","tour.f.use.title":"Use and share","tour.f.use.body":"Use theme sets it for Just me or for Everyone. From the same window you can copy a share code or download the theme file.","tour.f.base.title":"Base colour","tour.f.base.body":"Tap the swatch to pick a colour or type a hex code. All automatic colours are worked out from it.","tour.f.adjust.title":"Adjust","tour.f.adjust.body":"Contrast, saturation, tone, hue shift, accent strength and neutral surfaces fine-tune the whole palette at once.","tour.f.style.title":"Style and colour model","tour.f.style.body":"Style sets the overall mood. Even (OKLCH) keeps shades equally bright across colours, so a yellow and a blue theme feel alike.","tour.f.roles.title":"Colours in use","tour.f.roles.body":"Every colour is on Auto or Manual. Choose Manual to set a colour yourself \u2013 Theme Studio never changes a manual colour.","tour.f.more.title":"More colours and fine-tuning","tour.f.more.body":"Open these to set header, divider and sidebar colours, or to adjust each surface \u2013 cards, Bubble cards, pop-ups \u2013 on its own.","tour.f.mirror.title":"Make Dark from Light","tour.f.mirror.body":"Copies the variant you are on to the other one with the lightness turned around, so it stays readable. Undo brings the old one back.","tour.f.link.title":"Same for Light and Dark","tour.f.link.body":"On in Surfaces, Background and Type, one change applies to both variants. Off, you change only the one you are on.","tour.f.shape.title":"Shape and glass","tour.f.shape.body":"Round the corners of cards and chips, and make cards see-through with a glass blur. Lower the opacity first to see the blur.","tour.f.border.title":"Borders","tour.f.border.body":"Pick a border style from the tiles \u2013 they show the border only \u2013 then set its size and opacity. Border colour is underneath.","tour.f.shadow.title":"Shadows","tour.f.shadow.body":"Pick a shadow from the tiles \u2013 they show the shadow only \u2013 then set size and opacity. Shadow colour is underneath.","tour.f.bubble.title":"Bubble Card and pop-ups","tour.f.bubble.body":"Choose whether Bubble cards and pop-ups get the same border and shadow as your other cards.","tour.f.image.title":"Background image","tour.f.image.body":"Pick an image from /config/www/background or upload your own. Image visibility fades between the page colour and the full image.","tour.f.overlay.title":"Overlay","tour.f.overlay.body":"Lay a pattern or light effect over the background, and set its strength, start, size and spread.","tour.f.header.title":"Header blend","tour.f.header.body":"Blends the top of the page into the background so the header melts into it. Blend height sets how far down it goes.","tour.f.scroll.title":"When you scroll","tour.f.scroll.body":"Stays put keeps the background still behind the cards. Scrolls with the page moves it up together with them.","tour.f.fonts.title":"Fonts","tour.f.fonts.body":"Pick the font for your dashboards. Theme Studio loads the fonts in Home Assistant for you \u2013 nothing to install.","tour.f.ownfont.title":"Your own font","tour.f.ownfont.body":"Put a font file in /config/www/fonts/, turn on Use my own font and enter its name and path.","tour.f.check.title":"Contrast check","tour.f.check.body":"Every text and icon colour is measured against what it sits on. Use Auto switches the manual colours of a weak pair back to automatic.","tour.f.preview.title":"Preview","tour.f.preview.body":"See the theme on a phone, a tablet or a computer \u2013 or Light and Dark side by side. It updates while you work.","tour.f.delete.title":"Delete a theme","tour.f.delete.body":"On your own themes, Delete theme is at the bottom of each section. A backup copy is kept, and built-in presets can't be deleted.","tour.f.end.title":"You know it all","tour.f.end.body":"That was every function. Start this tour again any time with ?, or pick Quick start for the short version."};var nt={"common.loading":"Cargando\u2026","common.try_again":"Reintentar","common.close":"Cerrar","common.cancel":"Cancelar","error.name_taken":"Ese nombre ya lo usa otro tema.","error.unauthorized":"Solo los administradores pueden cambiar temas.","error.unknown":"error desconocido","upload.not_an_image":"Ese archivo no es una imagen.","upload.unsupported_format":"Usa una imagen PNG, JPEG, WebP o GIF.","upload.too_large":"La imagen ocupa m\xE1s de 15 MB.","lib.themes_count":"{count} temas \xB7 claro y oscuro","lib.tagline":"Temas para Home Assistant","lib.reload":"Recargar temas","lib.import":"Importar","lib.import_label":"Importar un tema","lib.new_theme":"Nuevo tema","lib.title":"Tus temas","lib.sub":"Abre un tema para cambiarlo. Los temas predefinidos se copian la primera vez que los cambias, as\xED siempre se quedan como est\xE1n.","lib.filter":"Mostrar","lib.all":"Todos","lib.mine":"M\xEDos","lib.builtin":"Predefinidos","lib.group_mine":"M\xEDos","lib.group_builtin":"Temas predefinidos","lib.load_failed":"No se pudieron cargar los temas","lib.loading":"Cargando temas\u2026","lib.open":"Abrir {name}","lib.card_builtin":"Tema predefinido","lib.card_mine":"M\xEDo","lib.to_check":"{count} por revisar","lib.in_use_everyone":"En uso \xB7 todos","lib.in_use_you":"En uso \xB7 t\xFA","status.view_only":"Solo lectura \xB7 pide a un administrador que cambie los temas","status.builtin":"Tema predefinido \xB7 tu primer cambio crea una copia","status.saving":"Guardando\u2026","status.unsaved":"Cambios sin guardar","status.error":"No guardado: {error}","status.saved":"Todos los cambios guardados","editor.back":"Volver a todos los temas","editor.name":"Nombre del tema","editor.undo":"Deshacer","editor.redo":"Rehacer","editor.variant":"Variante a editar","editor.use":"Usar tema","editor.load_failed":"No se pudo cargar {name}","editor.not_built":"No se pudo generar este tema.","editor.sections":"Secciones","editor.controls":"Ajustes","editor.builtin_banner":"Este es un tema predefinido. Si cambias algo, Theme Studio crea tu propia copia; el tema predefinido no se toca.","editor.delete":"Eliminar tema","editor.copy_name":"{name} (copia)","variant.light":"Claro","variant.dark":"Oscuro","link.title":"Igual para Claro y Oscuro","link.on":"Los cambios aqu\xED se aplican a ambas variantes.","link.off":"Los cambios aqu\xED solo se aplican a {variant}.","section.colours":"Colores","section.colours.description":"Empieza con un color base. Todo lo que est\xE1 en Auto se calcula a partir de \xE9l y se mantiene legible.","section.surfaces":"Superficies","section.surfaces.description":"Forma, cristal, bordes y sombras de tarjetas, tarjetas Bubble y ventanas emergentes.","section.background":"Fondo","section.background.description":"Un color liso o una imagen detr\xE1s de tus paneles. El color de la p\xE1gina est\xE1 en Colores.","section.type":"Tipograf\xEDa","section.type.description":"La tipograf\xEDa que usan tus paneles.","section.check":"Revisar","section.check.description":"Cada color de texto e icono medido contra lo que tiene detr\xE1s.","group.base":"Color base","group.adjust":"Ajustar","group.roles":"Colores en uso","group.roles.hint":"Theme Studio nunca cambia los colores manuales. Toca una muestra manual para elegir un color.","group.more":"M\xE1s colores","group.finetune":"Ajuste fino por superficie","group.mirror":"Claro y Oscuro","group.shape":"Forma","group.shape.hint":"Las esquinas de chips redondean los peque\xF1os botones en forma de p\xEDldora (Sal\xF3n, Cocina \u2026 en la vista previa). Las tarjetas propias de Home Assistant no lo usan; tus propios estilos de card-mod s\xED pueden, con --theme-studio-chip-radius.","group.glass":"Cristal","group.glass.hint":"El desenfoque se ve en tarjetas transl\xFAcidas: baja primero la opacidad.","group.border":"Borde","group.border.hint":"Los mosaicos solo muestran el borde.","group.border-fine":"Color del borde","group.shadow":"Sombra","group.shadow.hint":"Los mosaicos solo muestran la sombra.","group.shadow-fine":"Color de la sombra","group.bubble":"Bubble Card y ventanas","group.image":"Imagen","group.overlay":"Superposici\xF3n","group.header":"Cabecera","group.font":"Tipograf\xEDa","group.font.hint":"Theme Studio carga estas fuentes en Home Assistant por ti; no hay que a\xF1adir nada como recurso. Orbitron no tiene \xF8/\xD8 propias.","group.custom-font":"Tu propia fuente","group.custom-font.hint":"Pon el archivo de fuente (.woff2, .woff, .ttf u .otf) en /config/www/fonts/ y escribe /local/fonts/<archivo>. Theme Studio la carga por ti.","ctl.contrast":"Contraste","ctl.saturation":"Saturaci\xF3n","ctl.tone":"Tono","ctl.hue_shift":"Cambio de matiz","ctl.accent_strength":"Intensidad del acento","ctl.neutrality":"Superficies neutras","ctl.preview_mode":"Estilo","ctl.color_model":"Modelo de color","ctl.color_model.hint":"Uniforme mantiene los tonos igual de claros en todos los colores, as\xED un tema amarillo y uno azul se sienten iguales.","ctl.surface_lift":"Luminosidad de las superficies","ctl.accent_contrast":"Contraste del acento","ctl.accent_hue_shift":"Cambio de matiz del acento","ctl.accent_saturation":"Saturaci\xF3n del acento","ctl.card_bg_contrast":"Contraste de tarjetas","ctl.card_bg_hue_shift":"Cambio de matiz de tarjetas","ctl.card_bg_saturation":"Saturaci\xF3n de tarjetas","ctl.bubble_bg_contrast":"Contraste de tarjetas Bubble","ctl.bubble_bg_hue_shift":"Cambio de matiz de tarjetas Bubble","ctl.bubble_bg_saturation":"Saturaci\xF3n de tarjetas Bubble","ctl.popup_bg_contrast":"Contraste de ventanas","ctl.popup_bg_hue_shift":"Cambio de matiz de ventanas","ctl.popup_bg_saturation":"Saturaci\xF3n de ventanas","ctl.bubble_slider_contrast":"Contraste del deslizador Bubble","ctl.bubble_slider_hue_shift":"Cambio de matiz del deslizador Bubble","ctl.bubble_slider_saturation":"Saturaci\xF3n del deslizador Bubble","ctl.bubble_slider_opacity":"Opacidad del deslizador Bubble","ctl.radius":"Esquinas de tarjetas","ctl.chip_radius":"Esquinas de chips","ctl.card_opacity":"Opacidad de tarjetas","ctl.blur_strength":"Desenfoque de cristal","ctl.bubble_bg_opacity":"Opacidad de tarjetas Bubble","ctl.popup_bg_opacity":"Opacidad de ventanas","ctl.navbar_bg_opacity":"Opacidad de la barra de navegaci\xF3n","ctl.border_size":"Grosor del borde","ctl.border_opacity":"Opacidad del borde","ctl.border_contrast":"Contraste","ctl.border_hue_shift":"Cambio de matiz","ctl.border_saturation":"Saturaci\xF3n","ctl.shadow_size":"Tama\xF1o de la sombra","ctl.shadow_opacity":"Opacidad de la sombra","ctl.shadow_contrast":"Contraste","ctl.shadow_hue_shift":"Cambio de matiz","ctl.shadow_saturation":"Saturaci\xF3n","ctl.bubble_use_fx":"Borde y sombra en tarjetas Bubble","ctl.popup_use_fx":"Borde y sombra en ventanas emergentes","ctl.background_contrast":"Visibilidad de la imagen","ctl.background_attachment":"Al desplazarte","ctl.background_attachment.hint":"Se queda fijo mantiene el fondo quieto detr\xE1s de las tarjetas. Se mueve con la p\xE1gina lo hace subir con ellas.","ctl.overlay_contrast":"Intensidad de la superposici\xF3n","ctl.overlay_offset_y":"La superposici\xF3n empieza desde arriba","ctl.overlay_scale":"Tama\xF1o de la superposici\xF3n","ctl.overlay_spread":"Extensi\xF3n de la superposici\xF3n","ctl.enable_header_blend":"Fundir la cabecera con la p\xE1gina","ctl.header_blend_height":"Altura de la transici\xF3n","ctl.use_custom_font":"Usar mi propia fuente","ctl.custom_font_family":"Nombre de la fuente","ctl.custom_font_path":"Archivo de fuente","end.soft":"Suave","end.strong":"Fuerte","end.muted":"Apagado","end.vivid":"Vivo","end.darker":"M\xE1s oscuro","end.lighter":"M\xE1s claro","end.tinted":"Te\xF1ido","end.neutral":"Neutro","end.page_colour":"Color de p\xE1gina","end.full_image":"Imagen completa","opt.Relaxed":"Relajado","opt.Focused":"Enfocado","opt.Vibrant":"Vibrante","opt.hsl":"Cl\xE1sico","opt.oklch":"Uniforme (OKLCH)","opt.fixed":"Se queda fijo","opt.scroll":"Se mueve con la p\xE1gina","border.none":"Ninguno","border.soft_hairline":"L\xEDnea fina","border.glass_edge":"Borde de cristal","border.etched":"Grabado","border.inner_glow":"Brillo interior","border.accent_line":"L\xEDnea de acento","border.double_line":"L\xEDnea doble","border.bevel_edge":"Biselado","border.glow_line":"L\xEDnea luminosa","shadow.none":"Ninguna","shadow.soft_depth":"Profundidad suave","shadow.glass_glow":"Brillo de cristal","shadow.ambient_lift":"Elevaci\xF3n ambiental","shadow.neon_glow":"Brillo ne\xF3n","shadow.studio_depth":"Profundidad de estudio","shadow.drop_shadow":"Sombra proyectada","shadow.soft_float":"Flotaci\xF3n suave","shadow.cinematic_depth":"Cinem\xE1tica","overlay.none":"Ninguna","overlay.soft_veil":"Velo suave","overlay.mesh_glow":"Brillo de malla","overlay.vignette":"Vi\xF1eta","overlay.aurora":"Aurora","overlay.aurora_vertical":"Aurora vertical","overlay.spotlight":"Foco","overlay.diagonal_fade":"Degradado diagonal","overlay.topographic":"Topogr\xE1fico","overlay.mist":"Niebla","overlay.frost":"Escarcha","overlay.dual_orb":"Doble esfera","overlay.soft_stripes":"Rayas suaves","overlay.cinematic":"Cinem\xE1tico","overlay.halo":"Halo","font.sans-serif":"Sans serif","font.system-ui":"Sistema","role.page":"Fondo de p\xE1gina","role.card":"Tarjetas","role.bubble":"Tarjetas Bubble","role.popup":"Ventanas emergentes","role.navbar":"Barra de navegaci\xF3n","role.accent":"Acento","role.slider":"Deslizador Bubble","role.text":"Texto","role.secondary":"Texto secundario","role.icon":"Iconos","role.active":"Iconos activos","role.navicon":"Iconos de la barra de navegaci\xF3n","role.headerbg":"Fondo de la cabecera","role.headertext":"Texto de la cabecera","role.secondarybg":"Fondo secundario","role.divider":"Separadores","role.sidebaricon":"Iconos de la barra lateral","role.disabled":"Texto desactivado","role.pick":"Elige un color para {role}","role.mode":"Modo de color de {role}","role.auto":"Auto","role.manual":"Manual","role.lowest":"Contraste m\xE1s bajo: {pair} (necesita {minimum}:1)","pair.text_page":"Texto en la p\xE1gina","pair.text_card":"Texto en tarjetas","pair.secondary_text_card":"Texto secundario en tarjetas","pair.icon_card":"Iconos en tarjetas","pair.active_icon_card":"Iconos activos en tarjetas","pair.text_bubble":"Texto en tarjetas Bubble","pair.icon_bubble":"Iconos en tarjetas Bubble","pair.text_popup":"Texto en ventanas emergentes","pair.navbar_icon":"Iconos de la barra de navegaci\xF3n","pair.header_text":"Texto de la cabecera","pair.sidebar_icon":"Iconos de la barra lateral","pair.text_on_accent":"Texto sobre el acento (insignias, chips)","pair.accent_page":"Acento en la p\xE1gina","pair.text_sub_button":"Texto en subbotones","base.pick":"Elegir color base","base.hex":"C\xF3digo hex","images.none":"Sin imagen","images.upload":"Subir imagen","images.uploading":"Subiendo\u2026","images.loading":"Cargando im\xE1genes\u2026","mirror.button":"Crear {target} desde {source}","mirror.hint":"Copia {source} en {target} invirtiendo la luminosidad, para que la copia siga siendo legible. Los colores fijados solo para {target} vuelven a Auto. Deshacer recupera el {target} anterior.","check.light":"Claro \xB7 {summary}","check.dark":"Oscuro \xB7 {summary}","check.all_readable":"los {count} legibles","check.some_low":"{failing} de {count} por revisar","check.ratio":"{ratio}:1 \xB7 necesita {minimum}:1","check.manual":"Manual: {roles}","check.readable":"Legible","check.use_auto":"Usar Auto","check.low":"Bajo","check.hint":"Los colores autom\xE1ticos siempre se hacen legibles. Usar Auto devuelve a autom\xE1tico los colores manuales de un par; Deshacer los recupera.","preview.label":"Vista previa","preview.both":"Claro + Oscuro","preview.size":"Tama\xF1o de la vista previa","device.phone":"Tel\xE9fono","device.tablet":"Tableta","device.desktop":"Ordenador","new.title":"Nuevo tema","new.sub":"Obtienes una variante clara y una oscura. Todo se puede cambiar despu\xE9s.","new.preset":"Desde un tema","new.preset_hint":"Copia un predefinido o uno de tus temas.","new.colour":"Desde un color","new.colour_hint":"Elige un color base; el resto se calcula.","new.image":"Desde una imagen","new.image_hint":"Los colores salen de una imagen de fondo.","new.import_hint":"Pega un c\xF3digo para compartir o elige un archivo de tema.","new.start_from":"Empezar desde","new.mine_option":"{name} (m\xEDo)","new.base":"Color base","new.no_images":"Todav\xEDa no hay im\xE1genes en /config/www/background.","new.name":"Nombre","new.placeholder":"Mi tema","new.placeholder_preset":"Mi {name}","new.placeholder_image":"Desde {name}","new.create":"Crear y abrir","use.title":"Usar \xAB{name}\xBB","use.sub":"Claro y Oscuro van juntos. Home Assistant cambia entre ellos seg\xFAn el modo oscuro del dispositivo.","use.me":"Solo yo","use.me_hint":"Tu perfil, en todos tus dispositivos. Los dem\xE1s mantienen su tema.","use.everyone":"Todos","use.everyone_hint":"El tema predeterminado. T\xFA tambi\xE9n lo sigues; quien haya elegido su propio tema en su perfil lo mantiene.","use.again":"Si haces m\xE1s cambios, vuelve a usar el tema para actualizarlo en todos los sitios donde se usa.","use.share":"Compartir","use.copy":"Copiar c\xF3digo para compartir","use.download":"Descargar archivo","use.share_hint":"Otros pueden importar el c\xF3digo o el archivo en su Theme Studio. Solo contiene colores y ajustes.","use.working":"Procesando\u2026","import.title":"Importar un tema","import.sub":"Pega un c\xF3digo para compartir (TS1:\u2026) o elige un archivo de tema. Se crea un tema nuevo; no se sobrescribe nada.","import.field":"C\xF3digo o contenido del archivo","import.file":"Elegir archivo","import.button":"Importar y abrir","delete.title":"\xBFEliminar \xAB{name}\xBB?","delete.sub":"El tema y su archivo de tema se quitan de Home Assistant. Una copia de seguridad del tema se queda en /config/theme_studio/user_themes.","delete.button":"Eliminar","toast.preview_failed":"Fall\xF3 la vista previa: {error}","toast.forked":"Los temas predefinidos se quedan como est\xE1n. Tus cambios se guardan en \xAB{name}\xBB.","toast.used_everyone":"\xAB{name}\xBB es ahora el tema de todos.","toast.used_you":"\xAB{name}\xBB es ahora tu tema.","toast.use_failed":"No se pudo usar el tema: {error}","toast.share_copied":"C\xF3digo copiado. P\xE9galo en Importar en otro Theme Studio.","toast.share_blocked":"Aqu\xED no se puede copiar; el c\xF3digo para compartir est\xE1 en Importar, en la p\xE1gina de inicio.","toast.downloaded":"{file} se ha descargado.","toast.share_failed":"No se pudo compartir: {error}","toast.imported":"\xAB{name}\xBB se ha importado.","toast.imported_renamed":"Importado como \xAB{name}\xBB porque el nombre ya estaba en uso.","toast.import_invalid":"Eso no es un c\xF3digo para compartir ni un archivo de tema de Theme Studio.","toast.import_failed":"No se pudo importar: {error}","toast.deleted":"\xAB{name}\xBB se ha eliminado. Una copia de seguridad se queda en la carpeta user_themes.","toast.delete_failed":"No se pudo eliminar: {error}","toast.mirrored":"{target} es ahora una copia de {source}. Deshacer recupera el anterior.","toast.mirror_failed":"No se pudo copiar: {error}","toast.created":"\xAB{name}\xBB se ha creado con una variante clara y una oscura.","toast.create_failed":"No se pudo crear el tema: {error}","toast.upload_unsupported":"Para subir archivos hace falta un frontend de Home Assistant m\xE1s reciente.","toast.uploaded":"{file} se ha subido y est\xE1 en uso.","toast.upload_failed":"No se pudo subir: {error}","toast.set_auto":"{roles} en Auto.","mock.home":"Casa","mock.sub":"Mi\xE9rcoles \xB7 14\xB0 fuera","mock.living_room":"Sal\xF3n","mock.kitchen":"Cocina","mock.bedroom":"Dormitorio","mock.garden":"Jard\xEDn","mock.ceiling":"Techo","mock.on_percent":"Encendida \xB7 70 %","mock.floor_lamp":"L\xE1mpara de pie","mock.off":"Apagada","mock.dining_table":"Mesa del comedor","mock.heating_to":"Calentando a 22\xB0","mock.playlist":"Lista de la noche","mock.speaker":"Altavoz de la cocina","mock.front_door":"Puerta de entrada","mock.locked":"Cerrada \xB7 hace 2 min","mock.away":"Modo ausente","tour.help":"Ayuda","tour.welcome.title":"Bienvenido a Theme Studio","tour.welcome.body":"Theme Studio crea temas completos para Home Assistant, claros y oscuros, a partir de un solo color. \xBFC\xF3mo quieres empezar?","tour.quick":"Inicio r\xE1pido","tour.quick.meta":"{count} pasos \xB7 1 minuto","tour.quick.desc":"Crea y usa tu primer tema.","tour.full":"Todas las funciones","tour.full.meta":"{count} pasos \xB7 unos 5 minutos","tour.full.desc":"Un recorrido por cada bot\xF3n y ajuste.","tour.language":"Idioma","tour.language.note":"El idioma sigue a tu Home Assistant. Tambi\xE9n puedes elegirlo aqu\xED; se aplica a todo Theme Studio.","tour.skip_all":"Saltar la gu\xEDa","tour.help_later":"Siempre est\xE1 en ?","tour.skip":"Saltar","tour.back":"Atr\xE1s","tour.next":"Siguiente","tour.done":"Listo","tour.step_of":"Paso {n} de {total}","tour.see_all":"Ver todas las funciones","tour.hint":"La gu\xEDa est\xE1 aqu\xED cuando la necesites.","tour.got_it":"Entendido","tour.chapter.quick":"Inicio r\xE1pido","tour.chapter.overview":"Resumen","tour.chapter.top":"Barra superior","tour.chapter.colours":"Colores","tour.chapter.surfaces":"Superficies","tour.chapter.background":"Fondo","tour.chapter.type":"Tipograf\xEDa","tour.chapter.check":"Revisar","tour.chapter.preview":"Vista previa","tour.chapter.finish":"Final","tour.q.new.title":"Crea tu primer tema","tour.q.new.body":"Toca Nuevo tema. Empieza desde un predefinido, un solo color o una foto: Theme Studio calcula el resto.","tour.q.base.title":"Elige el color base","tour.q.base.body":"Este \xFAnico color define todo el tema. Todo lo que est\xE1 en Auto lo sigue y se mantiene legible.","tour.q.variant.title":"Claro y Oscuro","tour.q.variant.body":"Cambia aqu\xED entre las dos variantes. Cada una se guarda por separado, as\xED Claro nunca sobrescribe Oscuro.","tour.q.check.title":"Revisa la legibilidad","tour.q.check.body":"Un n\xFAmero en Revisar significa que alg\xFAn texto o icono se lee mal. \xC1brelo y toca Usar Auto para arreglarlo.","tour.q.preview.title":"M\xEDralo en directo","tour.q.preview.body":"La vista previa se actualiza mientras cambias cosas. Prueba tel\xE9fono, tableta y ordenador, o Claro y Oscuro lado a lado.","tour.q.use.title":"Usa tu tema","tour.q.use.body":"Toca Usar tema. Solo yo lo pone en tu perfil; Todos lo convierte en el tema predeterminado de toda la casa.","tour.q.end.title":"\xA1Listo!","tour.q.end.body":"Tu tema se guarda solo. \xBFQuieres ver todo lo que hace Theme Studio? Haz el recorrido completo, o vuelve m\xE1s tarde con ?.","tour.f.cards.title":"Tus temas","tour.f.cards.body":"Cada tarjeta muestra la variante clara y la oscura lado a lado. Una etiqueta indica si el tema est\xE1 en uso o si hay algo que revisar en el contraste.","tour.f.filter.title":"Filtra la lista","tour.f.filter.body":"Muestra todos los temas, solo los tuyos o solo los predefinidos.","tour.f.new.title":"Nuevo tema","tour.f.new.body":"Tres formas de empezar: copia un predefinido o uno de tus temas, elige un color o toma los colores de una imagen de fondo.","tour.f.import.title":"Importar","tour.f.import.body":"Pega un c\xF3digo (TS1:\u2026) o elige un archivo de tema que te hayan pasado. Siempre se crea un tema nuevo; no se sobrescribe nada.","tour.f.reload.title":"Recargar","tour.f.reload.body":"Vuelve a leer los archivos de temas, por ejemplo si copiaste uno a mano en /config.","tour.f.name.title":"Nombre y guardado","tour.f.name.body":"Toca el nombre para cambiarlo. La l\xEDnea de abajo muestra si todo est\xE1 guardado: ocurre un momento despu\xE9s de cada cambio.","tour.f.undo.title":"Deshacer y Rehacer","tour.f.undo.body":"Retrocede y avanza por tus cambios, tambi\xE9n despu\xE9s de cambiar de secci\xF3n.","tour.f.variant.title":"Claro y Oscuro","tour.f.variant.body":"Elige qu\xE9 variante est\xE1s editando. Las dos se guardan por separado.","tour.f.use.title":"Usar y compartir","tour.f.use.body":"Usar tema lo activa para Solo yo o para Todos. En la misma ventana puedes copiar un c\xF3digo o descargar el archivo del tema.","tour.f.base.title":"Color base","tour.f.base.body":"Toca la muestra para elegir un color o escribe un c\xF3digo hex. Todos los colores autom\xE1ticos salen de \xE9l.","tour.f.adjust.title":"Ajustar","tour.f.adjust.body":"Contraste, saturaci\xF3n, tono, cambio de matiz, intensidad del acento y superficies neutras afinan toda la paleta a la vez.","tour.f.style.title":"Estilo y modelo de color","tour.f.style.body":"El estilo marca el ambiente general. Uniforme (OKLCH) mantiene los tonos igual de claros en todos los colores, as\xED un tema amarillo y uno azul se sienten iguales.","tour.f.roles.title":"Colores en uso","tour.f.roles.body":"Cada color est\xE1 en Auto o Manual. Elige Manual para fijarlo t\xFA: Theme Studio nunca cambia un color manual.","tour.f.more.title":"M\xE1s colores y ajuste fino","tour.f.more.body":"\xC1brelos para dar color a la cabecera, los separadores y la barra lateral, o para ajustar cada superficie (tarjetas, tarjetas Bubble, ventanas emergentes) por separado.","tour.f.mirror.title":"Crear Oscuro desde Claro","tour.f.mirror.body":"Copia la variante actual en la otra invirtiendo la luminosidad, para que siga siendo legible. Deshacer recupera la anterior.","tour.f.link.title":"Igual para Claro y Oscuro","tour.f.link.body":"Activado en Superficies, Fondo y Tipograf\xEDa, un cambio se aplica a ambas variantes. Desactivado, solo cambias la actual.","tour.f.shape.title":"Forma y cristal","tour.f.shape.body":"Redondea las esquinas de tarjetas y chips, y haz las tarjetas transl\xFAcidas con desenfoque de cristal. Baja primero la opacidad para ver el desenfoque.","tour.f.border.title":"Bordes","tour.f.border.body":"Elige un estilo de borde en los mosaicos (solo muestran el borde) y ajusta grosor y opacidad. El color del borde est\xE1 debajo.","tour.f.shadow.title":"Sombras","tour.f.shadow.body":"Elige una sombra en los mosaicos (solo muestran la sombra) y ajusta tama\xF1o y opacidad. El color de la sombra est\xE1 debajo.","tour.f.bubble.title":"Bubble Card y ventanas","tour.f.bubble.body":"Decide si las tarjetas Bubble y las ventanas emergentes llevan el mismo borde y sombra que tus otras tarjetas.","tour.f.image.title":"Imagen de fondo","tour.f.image.body":"Elige una imagen de /config/www/background o sube la tuya. La visibilidad de la imagen pasa del color de la p\xE1gina a la imagen completa.","tour.f.overlay.title":"Superposici\xF3n","tour.f.overlay.body":"Pon un patr\xF3n o un efecto de luz sobre el fondo, y ajusta intensidad, inicio, tama\xF1o y extensi\xF3n.","tour.f.header.title":"Transici\xF3n de la cabecera","tour.f.header.body":"Funde la parte superior de la p\xE1gina con el fondo para que la cabecera se integre. La altura de la transici\xF3n marca hasta d\xF3nde llega.","tour.f.scroll.title":"Al desplazarte","tour.f.scroll.body":"Se queda fijo mantiene el fondo quieto detr\xE1s de las tarjetas. Se mueve con la p\xE1gina lo hace subir junto con ellas.","tour.f.fonts.title":"Tipograf\xEDas","tour.f.fonts.body":"Elige la fuente de tus paneles. Theme Studio carga las fuentes en Home Assistant por ti; no hay nada que instalar.","tour.f.ownfont.title":"Tu propia fuente","tour.f.ownfont.body":"Pon un archivo de fuente en /config/www/fonts/, activa Usar mi propia fuente y escribe su nombre y ruta.","tour.f.check.title":"Revisi\xF3n de contraste","tour.f.check.body":"Cada color de texto e icono se mide contra lo que tiene detr\xE1s. Usar Auto devuelve a autom\xE1tico los colores manuales de un par d\xE9bil.","tour.f.preview.title":"Vista previa","tour.f.preview.body":"Mira el tema en tel\xE9fono, tableta u ordenador, o Claro y Oscuro lado a lado. Se actualiza mientras trabajas.","tour.f.delete.title":"Eliminar un tema","tour.f.delete.body":"En tus propios temas, Eliminar tema est\xE1 al final de cada secci\xF3n. Se guarda una copia de seguridad y los predefinidos no se pueden eliminar.","tour.f.end.title":"Ya lo conoces todo","tour.f.end.body":"Esas eran todas las funciones. Vuelve a empezar el recorrido cuando quieras con ?, o elige Inicio r\xE1pido para la versi\xF3n corta."};var st={"common.loading":"Chargement\u2026","common.try_again":"R\xE9essayer","common.close":"Fermer","common.cancel":"Annuler","error.name_taken":"Ce nom est d\xE9j\xE0 utilis\xE9 par un autre th\xE8me.","error.unauthorized":"Seuls les administrateurs peuvent modifier les th\xE8mes.","error.unknown":"erreur inconnue","upload.not_an_image":"Ce fichier n'est pas une image.","upload.unsupported_format":"Utilisez une image PNG, JPEG, WebP ou GIF.","upload.too_large":"L'image d\xE9passe 15 Mo.","lib.themes_count":"{count} th\xE8mes \xB7 clair et sombre","lib.tagline":"Des th\xE8mes pour Home Assistant","lib.reload":"Recharger les th\xE8mes","lib.import":"Importer","lib.import_label":"Importer un th\xE8me","lib.new_theme":"Nouveau th\xE8me","lib.title":"Vos th\xE8mes","lib.sub":"Ouvrez un th\xE8me pour le modifier. Les th\xE8mes int\xE9gr\xE9s sont copi\xE9s la premi\xE8re fois que vous les modifiez, ils restent donc toujours tels quels.","lib.filter":"Afficher","lib.all":"Tous","lib.mine":"Les miens","lib.builtin":"Int\xE9gr\xE9s","lib.group_mine":"Les miens","lib.group_builtin":"Th\xE8mes int\xE9gr\xE9s","lib.load_failed":"Impossible de charger les th\xE8mes","lib.loading":"Chargement des th\xE8mes\u2026","lib.open":"Ouvrir {name}","lib.card_builtin":"Th\xE8me int\xE9gr\xE9","lib.card_mine":"Le mien","lib.to_check":"{count} \xE0 v\xE9rifier","lib.in_use_everyone":"Utilis\xE9 \xB7 tous","lib.in_use_you":"Utilis\xE9 \xB7 vous","status.view_only":"Lecture seule \xB7 demandez \xE0 un administrateur pour modifier les th\xE8mes","status.builtin":"Th\xE8me int\xE9gr\xE9 \xB7 votre premi\xE8re modification cr\xE9e une copie","status.saving":"Enregistrement\u2026","status.unsaved":"Modifications non enregistr\xE9es","status.error":"Non enregistr\xE9 : {error}","status.saved":"Toutes les modifications sont enregistr\xE9es","editor.back":"Retour \xE0 tous les th\xE8mes","editor.name":"Nom du th\xE8me","editor.undo":"Annuler","editor.redo":"R\xE9tablir","editor.variant":"Variante \xE0 modifier","editor.use":"Utiliser le th\xE8me","editor.load_failed":"Impossible de charger {name}","editor.not_built":"Ce th\xE8me n'a pas pu \xEAtre g\xE9n\xE9r\xE9.","editor.sections":"Sections","editor.controls":"R\xE9glages","editor.builtin_banner":"Ceci est un th\xE8me int\xE9gr\xE9. D\xE8s que vous modifiez quelque chose, Theme Studio cr\xE9e votre propre copie ; le th\xE8me int\xE9gr\xE9 reste intact.","editor.delete":"Supprimer le th\xE8me","editor.copy_name":"{name} (copie)","variant.light":"Clair","variant.dark":"Sombre","link.title":"Identique pour Clair et Sombre","link.on":"Les modifications ici s'appliquent aux deux variantes.","link.off":"Les modifications ici ne s'appliquent qu'\xE0 {variant}.","section.colours":"Couleurs","section.colours.description":"Commencez par une couleur de base. Tout ce qui est sur Auto en est d\xE9duit et reste lisible.","section.surfaces":"Surfaces","section.surfaces.description":"Forme, verre, bordures et ombres des cartes, cartes Bubble et fen\xEAtres.","section.background":"Arri\xE8re-plan","section.background.description":"Une couleur de page unie ou une image derri\xE8re vos tableaux de bord. La couleur de page se trouve dans Couleurs.","section.type":"Police","section.type.description":"La police de vos tableaux de bord.","section.check":"V\xE9rifier","section.check.description":"Chaque couleur de texte et d'ic\xF4ne mesur\xE9e par rapport \xE0 son fond.","group.base":"Couleur de base","group.adjust":"Ajuster","group.roles":"Couleurs utilis\xE9es","group.roles.hint":"Theme Studio ne modifie jamais les couleurs manuelles. Touchez un \xE9chantillon manuel pour choisir une couleur.","group.more":"Plus de couleurs","group.finetune":"R\xE9glage fin par surface","group.mirror":"Clair et Sombre","group.shape":"Forme","group.shape.hint":"Les coins des puces arrondissent les petits boutons en forme de pilule (Salon, Cuisine \u2026 dans l'aper\xE7u). Les cartes de Home Assistant ne les utilisent pas ; vos propres styles card-mod le peuvent, via --theme-studio-chip-radius.","group.glass":"Verre","group.glass.hint":"Le flou appara\xEEt sur les cartes translucides : baissez d'abord l'opacit\xE9.","group.border":"Bordure","group.border.hint":"Les vignettes ne montrent que la bordure.","group.border-fine":"Couleur de bordure","group.shadow":"Ombre","group.shadow.hint":"Les vignettes ne montrent que l'ombre.","group.shadow-fine":"Couleur d'ombre","group.bubble":"Bubble Card et fen\xEAtres","group.image":"Image","group.overlay":"Superposition","group.header":"En-t\xEAte","group.font":"Police","group.font.hint":"Theme Studio charge ces polices dans Home Assistant pour vous ; rien \xE0 ajouter comme ressource. Orbitron n'a pas de \xF8/\xD8 propre.","group.custom-font":"Votre propre police","group.custom-font.hint":"Placez le fichier de police (.woff2, .woff, .ttf ou .otf) dans /config/www/fonts/ et saisissez /local/fonts/<fichier>. Theme Studio la charge pour vous.","ctl.contrast":"Contraste","ctl.saturation":"Saturation","ctl.tone":"Tonalit\xE9","ctl.hue_shift":"D\xE9calage de teinte","ctl.accent_strength":"Force de l'accent","ctl.neutrality":"Surfaces neutres","ctl.preview_mode":"Style","ctl.color_model":"Mod\xE8le de couleur","ctl.color_model.hint":"Uniforme garde des teintes aussi lumineuses d'une couleur \xE0 l'autre : un th\xE8me jaune et un th\xE8me bleu donnent la m\xEAme impression.","ctl.surface_lift":"Luminosit\xE9 des surfaces","ctl.accent_contrast":"Contraste de l'accent","ctl.accent_hue_shift":"D\xE9calage de teinte de l'accent","ctl.accent_saturation":"Saturation de l'accent","ctl.card_bg_contrast":"Contraste des cartes","ctl.card_bg_hue_shift":"D\xE9calage de teinte des cartes","ctl.card_bg_saturation":"Saturation des cartes","ctl.bubble_bg_contrast":"Contraste des cartes Bubble","ctl.bubble_bg_hue_shift":"D\xE9calage de teinte des cartes Bubble","ctl.bubble_bg_saturation":"Saturation des cartes Bubble","ctl.popup_bg_contrast":"Contraste des fen\xEAtres","ctl.popup_bg_hue_shift":"D\xE9calage de teinte des fen\xEAtres","ctl.popup_bg_saturation":"Saturation des fen\xEAtres","ctl.bubble_slider_contrast":"Contraste du curseur Bubble","ctl.bubble_slider_hue_shift":"D\xE9calage de teinte du curseur Bubble","ctl.bubble_slider_saturation":"Saturation du curseur Bubble","ctl.bubble_slider_opacity":"Opacit\xE9 du curseur Bubble","ctl.radius":"Coins des cartes","ctl.chip_radius":"Coins des puces","ctl.card_opacity":"Opacit\xE9 des cartes","ctl.blur_strength":"Flou de verre","ctl.bubble_bg_opacity":"Opacit\xE9 des cartes Bubble","ctl.popup_bg_opacity":"Opacit\xE9 des fen\xEAtres","ctl.navbar_bg_opacity":"Opacit\xE9 de la barre de navigation","ctl.border_size":"\xC9paisseur de bordure","ctl.border_opacity":"Opacit\xE9 de bordure","ctl.border_contrast":"Contraste","ctl.border_hue_shift":"D\xE9calage de teinte","ctl.border_saturation":"Saturation","ctl.shadow_size":"Taille de l'ombre","ctl.shadow_opacity":"Opacit\xE9 de l'ombre","ctl.shadow_contrast":"Contraste","ctl.shadow_hue_shift":"D\xE9calage de teinte","ctl.shadow_saturation":"Saturation","ctl.bubble_use_fx":"Bordure et ombre sur les cartes Bubble","ctl.popup_use_fx":"Bordure et ombre sur les fen\xEAtres","ctl.background_contrast":"Visibilit\xE9 de l'image","ctl.background_attachment":"Au d\xE9filement","ctl.background_attachment.hint":"Reste en place garde l'arri\xE8re-plan immobile derri\xE8re les cartes. D\xE9file avec la page le fait monter avec elles.","ctl.overlay_contrast":"Intensit\xE9 de la superposition","ctl.overlay_offset_y":"D\xE9but de la superposition depuis le haut","ctl.overlay_scale":"Taille de la superposition","ctl.overlay_spread":"\xC9tendue de la superposition","ctl.enable_header_blend":"Fondre l'en-t\xEAte dans la page","ctl.header_blend_height":"Hauteur de transition","ctl.use_custom_font":"Utiliser ma propre police","ctl.custom_font_family":"Nom de la police","ctl.custom_font_path":"Fichier de police","end.soft":"Doux","end.strong":"Fort","end.muted":"Att\xE9nu\xE9","end.vivid":"Vif","end.darker":"Plus sombre","end.lighter":"Plus clair","end.tinted":"Teint\xE9","end.neutral":"Neutre","end.page_colour":"Couleur de page","end.full_image":"Image compl\xE8te","opt.Relaxed":"D\xE9tendu","opt.Focused":"Concentr\xE9","opt.Vibrant":"\xC9clatant","opt.hsl":"Classique","opt.oklch":"Uniforme (OKLCH)","opt.fixed":"Reste en place","opt.scroll":"D\xE9file avec la page","border.none":"Aucune","border.soft_hairline":"Filet","border.glass_edge":"Bord de verre","border.etched":"Grav\xE9","border.inner_glow":"Lueur int\xE9rieure","border.accent_line":"Ligne d'accent","border.double_line":"Double ligne","border.bevel_edge":"Biseau","border.glow_line":"Ligne lumineuse","shadow.none":"Aucune","shadow.soft_depth":"Profondeur douce","shadow.glass_glow":"Halo de verre","shadow.ambient_lift":"\xC9l\xE9vation ambiante","shadow.neon_glow":"Lueur n\xE9on","shadow.studio_depth":"Profondeur studio","shadow.drop_shadow":"Ombre port\xE9e","shadow.soft_float":"Flottement doux","shadow.cinematic_depth":"Cin\xE9matique","overlay.none":"Aucune","overlay.soft_veil":"Voile doux","overlay.mesh_glow":"Maillage lumineux","overlay.vignette":"Vignette","overlay.aurora":"Aurore","overlay.aurora_vertical":"Aurore verticale","overlay.spotlight":"Projecteur","overlay.diagonal_fade":"Fondu diagonal","overlay.topographic":"Topographique","overlay.mist":"Brume","overlay.frost":"Givre","overlay.dual_orb":"Double orbe","overlay.soft_stripes":"Rayures douces","overlay.cinematic":"Cin\xE9matique","overlay.halo":"Halo","font.sans-serif":"Sans-serif","font.system-ui":"Syst\xE8me","role.page":"Fond de page","role.card":"Cartes","role.bubble":"Cartes Bubble","role.popup":"Fen\xEAtres","role.navbar":"Barre de navigation","role.accent":"Accent","role.slider":"Curseur Bubble","role.text":"Texte","role.secondary":"Texte secondaire","role.icon":"Ic\xF4nes","role.active":"Ic\xF4nes actives","role.navicon":"Ic\xF4nes de la barre de navigation","role.headerbg":"Fond de l'en-t\xEAte","role.headertext":"Texte de l'en-t\xEAte","role.secondarybg":"Fond secondaire","role.divider":"S\xE9parateurs","role.sidebaricon":"Ic\xF4nes de la barre lat\xE9rale","role.disabled":"Texte d\xE9sactiv\xE9","role.pick":"Choisir une couleur pour {role}","role.mode":"Mode de couleur pour {role}","role.auto":"Auto","role.manual":"Manuel","role.lowest":"Contraste le plus faible : {pair} (requiert {minimum}:1)","pair.text_page":"Texte sur la page","pair.text_card":"Texte sur les cartes","pair.secondary_text_card":"Texte secondaire sur les cartes","pair.icon_card":"Ic\xF4nes sur les cartes","pair.active_icon_card":"Ic\xF4nes actives sur les cartes","pair.text_bubble":"Texte sur les cartes Bubble","pair.icon_bubble":"Ic\xF4nes sur les cartes Bubble","pair.text_popup":"Texte dans les fen\xEAtres","pair.navbar_icon":"Ic\xF4nes de la barre de navigation","pair.header_text":"Texte de l'en-t\xEAte","pair.sidebar_icon":"Ic\xF4nes de la barre lat\xE9rale","pair.text_on_accent":"Texte sur l'accent (badges, puces)","pair.accent_page":"Accent sur la page","pair.text_sub_button":"Texte sur les sous-boutons","base.pick":"Choisir la couleur de base","base.hex":"Code hex","images.none":"Aucune image","images.upload":"Importer une image","images.uploading":"Importation\u2026","images.loading":"Chargement des images\u2026","mirror.button":"Cr\xE9er {target} depuis {source}","mirror.hint":"Copie {source} vers {target} en inversant la luminosit\xE9, pour que la copie reste lisible. Les couleurs d\xE9finies uniquement pour {target} repassent sur Auto. Annuler restaure l'ancienne version de {target}.","check.light":"Clair \xB7 {summary}","check.dark":"Sombre \xB7 {summary}","check.all_readable":"les {count} lisibles","check.some_low":"{failing} sur {count} \xE0 v\xE9rifier","check.ratio":"{ratio}:1 \xB7 requiert {minimum}:1","check.manual":"Manuel : {roles}","check.readable":"Lisible","check.use_auto":"Utiliser Auto","check.low":"Faible","check.hint":"Les couleurs automatiques sont toujours rendues lisibles. Utiliser Auto remet en automatique les couleurs manuelles d'une paire ; Annuler les restaure.","preview.label":"Aper\xE7u","preview.both":"Clair + Sombre","preview.size":"Taille de l'aper\xE7u","device.phone":"T\xE9l\xE9phone","device.tablet":"Tablette","device.desktop":"Ordinateur","new.title":"Nouveau th\xE8me","new.sub":"Vous obtenez une variante claire et une variante sombre. Tout peut \xEAtre modifi\xE9 ensuite.","new.preset":"Depuis un th\xE8me","new.preset_hint":"Copiez un th\xE8me int\xE9gr\xE9 ou l'un des v\xF4tres.","new.colour":"Depuis une couleur","new.colour_hint":"Choisissez une couleur de base ; le reste est calcul\xE9.","new.image":"Depuis une image","new.image_hint":"Les couleurs viennent d'une image d'arri\xE8re-plan.","new.import_hint":"Collez un code de partage ou choisissez un fichier de th\xE8me.","new.start_from":"Partir de","new.mine_option":"{name} (le mien)","new.base":"Couleur de base","new.no_images":"Aucune image dans /config/www/background pour l'instant.","new.name":"Nom","new.placeholder":"Mon th\xE8me","new.placeholder_preset":"Mon {name}","new.placeholder_image":"Depuis {name}","new.create":"Cr\xE9er et ouvrir","use.title":"Utiliser \xAB {name} \xBB","use.sub":"Clair et Sombre vont ensemble. Home Assistant passe de l'un \xE0 l'autre selon le mode sombre de l'appareil.","use.me":"Moi seulement","use.me_hint":"Votre profil, sur tous vos appareils. Les autres gardent leur th\xE8me.","use.everyone":"Tout le monde","use.everyone_hint":"Le th\xE8me par d\xE9faut. Vous le suivez aussi ; les personnes qui ont choisi leur propre th\xE8me dans leur profil le conservent.","use.again":"Apr\xE8s d'autres modifications, utilisez \xE0 nouveau le th\xE8me pour le mettre \xE0 jour partout o\xF9 il est utilis\xE9.","use.share":"Partager","use.copy":"Copier le code de partage","use.download":"T\xE9l\xE9charger le fichier","use.share_hint":"D'autres peuvent importer le code ou le fichier dans leur Theme Studio. Il ne contient que des couleurs et des r\xE9glages.","use.working":"En cours\u2026","import.title":"Importer un th\xE8me","import.sub":"Collez un code de partage (TS1:\u2026) ou choisissez un fichier de th\xE8me. Il devient un nouveau th\xE8me ; rien n'est \xE9cras\xE9.","import.field":"Code de partage ou contenu du fichier","import.file":"Choisir un fichier","import.button":"Importer et ouvrir","delete.title":"Supprimer \xAB {name} \xBB ?","delete.sub":"Le th\xE8me et son fichier de th\xE8me sont retir\xE9s de Home Assistant. Une copie de sauvegarde du th\xE8me reste dans /config/theme_studio/user_themes.","delete.button":"Supprimer","toast.preview_failed":"\xC9chec de l'aper\xE7u : {error}","toast.forked":"Les th\xE8mes int\xE9gr\xE9s restent tels quels. Vos modifications sont enregistr\xE9es dans \xAB {name} \xBB.","toast.used_everyone":"\xAB {name} \xBB est maintenant le th\xE8me de tout le monde.","toast.used_you":"\xAB {name} \xBB est maintenant votre th\xE8me.","toast.use_failed":"Impossible d'utiliser le th\xE8me : {error}","toast.share_copied":"Code de partage copi\xE9. Collez-le dans Importer d'un autre Theme Studio.","toast.share_blocked":"La copie est bloqu\xE9e ici ; le code de partage se trouve dans Importer sur la page d'accueil.","toast.downloaded":"{file} est t\xE9l\xE9charg\xE9.","toast.share_failed":"Impossible de partager : {error}","toast.imported":"\xAB {name} \xBB est import\xE9.","toast.imported_renamed":"Import\xE9 sous le nom \xAB {name} \xBB, car le nom \xE9tait d\xE9j\xE0 pris.","toast.import_invalid":"Ce n'est pas un code de partage ni un fichier de th\xE8me Theme Studio.","toast.import_failed":"Impossible d'importer : {error}","toast.deleted":"\xAB {name} \xBB est supprim\xE9. Une copie de sauvegarde reste dans le dossier user_themes.","toast.delete_failed":"Impossible de supprimer : {error}","toast.mirrored":"{target} est maintenant une copie de {source}. Annuler restaure l'ancienne version.","toast.mirror_failed":"Impossible de copier : {error}","toast.created":"\xAB {name} \xBB est cr\xE9\xE9 avec une variante claire et une variante sombre.","toast.create_failed":"Impossible de cr\xE9er le th\xE8me : {error}","toast.upload_unsupported":"L'importation n\xE9cessite une version plus r\xE9cente de l'interface de Home Assistant.","toast.uploaded":"{file} est import\xE9 et utilis\xE9.","toast.upload_failed":"Impossible d'importer : {error}","toast.set_auto":"{roles} r\xE9gl\xE9 sur Auto.","mock.home":"Maison","mock.sub":"Mercredi \xB7 14\xB0 dehors","mock.living_room":"Salon","mock.kitchen":"Cuisine","mock.bedroom":"Chambre","mock.garden":"Jardin","mock.ceiling":"Plafonnier","mock.on_percent":"Allum\xE9 \xB7 70 %","mock.floor_lamp":"Lampadaire","mock.off":"\xC9teint","mock.dining_table":"Table \xE0 manger","mock.heating_to":"Chauffage \xE0 22\xB0","mock.playlist":"Playlist du soir","mock.speaker":"Enceinte de la cuisine","mock.front_door":"Porte d'entr\xE9e","mock.locked":"Verrouill\xE9e \xB7 il y a 2 min","mock.away":"Mode absence","tour.help":"Aide","tour.welcome.title":"Bienvenue dans Theme Studio","tour.welcome.body":"Theme Studio cr\xE9e des th\xE8mes complets pour Home Assistant, clairs et sombres, \xE0 partir d'une seule couleur. Comment voulez-vous commencer ?","tour.quick":"D\xE9marrage rapide","tour.quick.meta":"{count} \xE9tapes \xB7 1 minute","tour.quick.desc":"Cr\xE9ez et utilisez votre premier th\xE8me.","tour.full":"Toutes les fonctions","tour.full.meta":"{count} \xE9tapes \xB7 environ 5 minutes","tour.full.desc":"Une visite de chaque bouton et r\xE9glage.","tour.language":"Langue","tour.language.note":"La langue suit votre Home Assistant. Vous pouvez aussi la choisir ici ; elle s'applique \xE0 tout Theme Studio.","tour.skip_all":"Passer le guide","tour.help_later":"Il est toujours sous ?","tour.skip":"Passer","tour.back":"Retour","tour.next":"Suivant","tour.done":"Termin\xE9","tour.step_of":"\xC9tape {n} sur {total}","tour.see_all":"Voir toutes les fonctions","tour.hint":"Le guide est ici quand vous en avez besoin.","tour.got_it":"Compris","tour.chapter.quick":"D\xE9marrage rapide","tour.chapter.overview":"Vue d'ensemble","tour.chapter.top":"Barre du haut","tour.chapter.colours":"Couleurs","tour.chapter.surfaces":"Surfaces","tour.chapter.background":"Arri\xE8re-plan","tour.chapter.type":"Police","tour.chapter.check":"V\xE9rifier","tour.chapter.preview":"Aper\xE7u","tour.chapter.finish":"Pour finir","tour.q.new.title":"Cr\xE9ez votre premier th\xE8me","tour.q.new.body":"Touchez Nouveau th\xE8me. Partez d'un th\xE8me int\xE9gr\xE9, d'une seule couleur ou d'une photo : Theme Studio calcule le reste.","tour.q.base.title":"Choisissez la couleur de base","tour.q.base.body":"Cette seule couleur pilote tout le th\xE8me. Tout ce qui est sur Auto la suit et reste lisible.","tour.q.variant.title":"Clair et Sombre","tour.q.variant.body":"Passez ici d'une variante \xE0 l'autre. Chacune est enregistr\xE9e s\xE9par\xE9ment : Clair n'\xE9crase jamais Sombre.","tour.q.check.title":"V\xE9rifiez la lisibilit\xE9","tour.q.check.body":"Un chiffre sur V\xE9rifier signale un texte ou une ic\xF4ne difficile \xE0 lire. Ouvrez-le et touchez Utiliser Auto pour corriger.","tour.q.preview.title":"Voyez le r\xE9sultat en direct","tour.q.preview.body":"L'aper\xE7u se met \xE0 jour pendant vos modifications. Essayez t\xE9l\xE9phone, tablette et ordinateur, ou Clair et Sombre c\xF4te \xE0 c\xF4te.","tour.q.use.title":"Utilisez votre th\xE8me","tour.q.use.body":"Touchez Utiliser le th\xE8me. Moi seulement l'applique \xE0 votre profil ; Tout le monde en fait le th\xE8me par d\xE9faut de toute la maison.","tour.q.end.title":"C'est fait !","tour.q.end.body":"Votre th\xE8me est enregistr\xE9 automatiquement. Envie de d\xE9couvrir tout ce que Theme Studio sait faire ? Faites la visite compl\xE8te, ou revenez-y plus tard avec ?.","tour.f.cards.title":"Vos th\xE8mes","tour.f.cards.body":"Chaque carte montre les variantes claire et sombre c\xF4te \xE0 c\xF4te. Un badge indique si le th\xE8me est utilis\xE9 ou si quelque chose doit passer la v\xE9rification du contraste.","tour.f.filter.title":"Filtrer la liste","tour.f.filter.body":"Affichez tous les th\xE8mes, seulement les v\xF4tres ou seulement les th\xE8mes int\xE9gr\xE9s.","tour.f.new.title":"Nouveau th\xE8me","tour.f.new.body":"Trois fa\xE7ons de commencer : copier un th\xE8me int\xE9gr\xE9 ou l'un des v\xF4tres, choisir une couleur, ou reprendre les couleurs d'une image d'arri\xE8re-plan.","tour.f.import.title":"Importer","tour.f.import.body":"Collez un code de partage (TS1:\u2026) ou choisissez un fichier de th\xE8me re\xE7u de quelqu'un. Cela cr\xE9e toujours un nouveau th\xE8me : rien n'est \xE9cras\xE9.","tour.f.reload.title":"Recharger","tour.f.reload.body":"Relit les fichiers de th\xE8mes, par exemple apr\xE8s avoir copi\xE9 un fichier de th\xE8me \xE0 la main dans /config.","tour.f.name.title":"Nom et enregistrement","tour.f.name.body":"Touchez le nom pour renommer le th\xE8me. La ligne en dessous indique l'\xE9tat de l'enregistrement : tout est enregistr\xE9 un instant apr\xE8s chaque modification.","tour.f.undo.title":"Annuler et R\xE9tablir","tour.f.undo.body":"Revenez en arri\xE8re ou avancez dans vos modifications, m\xEAme apr\xE8s avoir chang\xE9 de section.","tour.f.variant.title":"Clair et Sombre","tour.f.variant.body":"Choisissez la variante que vous modifiez. Les deux sont enregistr\xE9es s\xE9par\xE9ment.","tour.f.use.title":"Utiliser et partager","tour.f.use.body":"Utiliser le th\xE8me l'applique pour Moi seulement ou pour Tout le monde. Dans la m\xEAme fen\xEAtre, copiez un code de partage ou t\xE9l\xE9chargez le fichier de th\xE8me.","tour.f.base.title":"Couleur de base","tour.f.base.body":"Touchez l'\xE9chantillon pour choisir une couleur ou saisissez un code hex. Toutes les couleurs automatiques en sont d\xE9duites.","tour.f.adjust.title":"Ajuster","tour.f.adjust.body":"Contraste, saturation, tonalit\xE9, d\xE9calage de teinte, force de l'accent et surfaces neutres affinent toute la palette d'un coup.","tour.f.style.title":"Style et mod\xE8le de couleur","tour.f.style.body":"Le style donne l'ambiance g\xE9n\xE9rale. Uniforme (OKLCH) garde des teintes aussi lumineuses d'une couleur \xE0 l'autre : un th\xE8me jaune et un th\xE8me bleu se ressemblent.","tour.f.roles.title":"Couleurs utilis\xE9es","tour.f.roles.body":"Chaque couleur est sur Auto ou Manuel. Choisissez Manuel pour la fixer vous-m\xEAme : Theme Studio ne modifie jamais une couleur manuelle.","tour.f.more.title":"Plus de couleurs et r\xE9glage fin","tour.f.more.body":"Ouvrez-les pour d\xE9finir les couleurs de l'en-t\xEAte, des s\xE9parateurs et de la barre lat\xE9rale, ou pour r\xE9gler chaque surface (cartes, cartes Bubble, fen\xEAtres) s\xE9par\xE9ment.","tour.f.mirror.title":"Cr\xE9er Sombre depuis Clair","tour.f.mirror.body":"Copie la variante actuelle vers l'autre en inversant la luminosit\xE9, pour qu'elle reste lisible. Annuler restaure l'ancienne.","tour.f.link.title":"Identique pour Clair et Sombre","tour.f.link.body":"Activ\xE9 dans Surfaces, Arri\xE8re-plan et Police, un changement s'applique aux deux variantes. D\xE9sactiv\xE9, vous ne modifiez que la variante actuelle.","tour.f.shape.title":"Forme et verre","tour.f.shape.body":"Arrondissez les coins des cartes et des puces, et rendez les cartes translucides avec un flou de verre. Baissez d'abord l'opacit\xE9 pour voir le flou.","tour.f.border.title":"Bordures","tour.f.border.body":"Choisissez un style de bordure parmi les vignettes (elles ne montrent que la bordure), puis r\xE9glez \xE9paisseur et opacit\xE9. La couleur de bordure est en dessous.","tour.f.shadow.title":"Ombres","tour.f.shadow.body":"Choisissez une ombre parmi les vignettes (elles ne montrent que l'ombre), puis r\xE9glez taille et opacit\xE9. La couleur d'ombre est en dessous.","tour.f.bubble.title":"Bubble Card et fen\xEAtres","tour.f.bubble.body":"Choisissez si les cartes Bubble et les fen\xEAtres re\xE7oivent la m\xEAme bordure et la m\xEAme ombre que vos autres cartes.","tour.f.image.title":"Image d'arri\xE8re-plan","tour.f.image.body":"Choisissez une image dans /config/www/background ou importez la v\xF4tre. La visibilit\xE9 de l'image passe de la couleur de page \xE0 l'image compl\xE8te.","tour.f.overlay.title":"Superposition","tour.f.overlay.body":"Ajoutez un motif ou un effet de lumi\xE8re sur l'arri\xE8re-plan, et r\xE9glez son intensit\xE9, son d\xE9but, sa taille et son \xE9tendue.","tour.f.header.title":"Transition de l'en-t\xEAte","tour.f.header.body":"Fond le haut de la page dans l'arri\xE8re-plan pour que l'en-t\xEAte s'y int\xE8gre. La hauteur de transition fixe jusqu'o\xF9 elle descend.","tour.f.scroll.title":"Au d\xE9filement","tour.f.scroll.body":"Reste en place garde l'arri\xE8re-plan immobile derri\xE8re les cartes. D\xE9file avec la page le fait monter avec elles.","tour.f.fonts.title":"Polices","tour.f.fonts.body":"Choisissez la police de vos tableaux de bord. Theme Studio charge les polices dans Home Assistant pour vous : rien \xE0 installer.","tour.f.ownfont.title":"Votre propre police","tour.f.ownfont.body":"Placez un fichier de police dans /config/www/fonts/, activez Utiliser ma propre police et saisissez son nom et son chemin.","tour.f.check.title":"V\xE9rification du contraste","tour.f.check.body":"Chaque couleur de texte et d'ic\xF4ne est mesur\xE9e par rapport \xE0 son fond. Utiliser Auto remet en automatique les couleurs manuelles d'une paire trop faible.","tour.f.preview.title":"Aper\xE7u","tour.f.preview.body":"Voyez le th\xE8me sur t\xE9l\xE9phone, tablette ou ordinateur, ou Clair et Sombre c\xF4te \xE0 c\xF4te. Il se met \xE0 jour pendant que vous travaillez.","tour.f.delete.title":"Supprimer un th\xE8me","tour.f.delete.body":"Sur vos propres th\xE8mes, Supprimer le th\xE8me se trouve en bas de chaque section. Une copie de sauvegarde est conserv\xE9e, et les th\xE8mes int\xE9gr\xE9s ne peuvent pas \xEAtre supprim\xE9s.","tour.f.end.title":"Vous savez tout","tour.f.end.body":"C'\xE9taient toutes les fonctions. Relancez la visite quand vous voulez avec ?, ou choisissez D\xE9marrage rapide pour la version courte."};var lt={"common.loading":"Laster inn\u2026","common.try_again":"Pr\xF8v igjen","common.close":"Lukk","common.cancel":"Avbryt","error.name_taken":"Navnet brukes allerede av et annet tema.","error.unauthorized":"Bare administratorer kan endre temaer.","error.unknown":"ukjent feil","upload.not_an_image":"Filen er ikke et bilde.","upload.unsupported_format":"Bruk et PNG-, JPEG-, WebP- eller GIF-bilde.","upload.too_large":"Bildet er st\xF8rre enn 15 MB.","lib.themes_count":"{count} temaer \xB7 lys og m\xF8rk","lib.tagline":"Temaer for Home Assistant","lib.reload":"Last inn temaer p\xE5 nytt","lib.import":"Importer","lib.import_label":"Importer et tema","lib.new_theme":"Nytt tema","lib.title":"Temaene dine","lib.sub":"\xC5pne et tema for \xE5 endre det. Innebygde forh\xE5ndsvalg kopieres f\xF8rste gang du endrer dem, s\xE5 de alltid forblir som de er.","lib.filter":"Vis","lib.all":"Alle","lib.mine":"Mine","lib.builtin":"Innebygde","lib.group_mine":"Mine","lib.group_builtin":"Innebygde forh\xE5ndsvalg","lib.load_failed":"Kunne ikke laste inn temaene","lib.loading":"Laster inn temaer\u2026","lib.open":"\xC5pne {name}","lib.card_builtin":"Innebygd forh\xE5ndsvalg","lib.card_mine":"Mitt","lib.to_check":"{count} m\xE5 sjekkes","lib.in_use_everyone":"I bruk \xB7 alle","lib.in_use_you":"I bruk \xB7 deg","status.view_only":"Bare visning \xB7 be en administrator om \xE5 endre temaer","status.builtin":"Innebygd forh\xE5ndsvalg \xB7 den f\xF8rste endringen lager en kopi","status.saving":"Lagrer\u2026","status.unsaved":"Ulagrede endringer","status.error":"Ikke lagret: {error}","status.saved":"Alle endringer er lagret","editor.back":"Tilbake til alle temaer","editor.name":"Temaets navn","editor.undo":"Angre","editor.redo":"Gj\xF8r om","editor.variant":"Variant du redigerer","editor.use":"Bruk tema","editor.load_failed":"Kunne ikke laste inn {name}","editor.not_built":"Dette temaet kunne ikke bygges.","editor.sections":"Seksjoner","editor.controls":"Innstillinger","editor.builtin_banner":"Dette er et innebygd forh\xE5ndsvalg. Endrer du noe, lager Theme Studio din egen kopi; selve forh\xE5ndsvalget forblir ur\xF8rt.","editor.delete":"Slett tema","editor.copy_name":"{name} (kopi)","variant.light":"Lys","variant.dark":"M\xF8rk","link.title":"Lik for Lys og M\xF8rk","link.on":"Endringer her gjelder begge variantene.","link.off":"Endringer her gjelder bare {variant}.","section.colours":"Farger","section.colours.description":"Start med \xE9n grunnfarge. Alt som st\xE5r p\xE5 Auto, regnes ut fra den og holdes lesbart.","section.surfaces":"Flater","section.surfaces.description":"Form, glass, kanter og skygger p\xE5 kort, Bubble-kort og popup-vinduer.","section.background":"Bakgrunn","section.background.description":"En ensfarget side eller et bilde bak dashbordene dine. Sidefargen ligger under Farger.","section.type":"Skrift","section.type.description":"Skrifttypen dashbordene dine bruker.","section.check":"Sjekk","section.check.description":"Hver tekst- og ikonfarge m\xE5lt mot det den st\xE5r p\xE5.","group.base":"Grunnfarge","group.adjust":"Juster","group.roles":"Farger i bruk","group.roles.hint":"Manuelle farger endres aldri av Theme Studio. Trykk p\xE5 et manuelt fargefelt for \xE5 velge en farge.","group.more":"Flere farger","group.finetune":"Finjuster hver flate","group.mirror":"Lys og M\xF8rk","group.shape":"Form","group.shape.hint":"Chiphj\xF8rner runder av de sm\xE5 pilleformede knappene (Stue, Kj\xF8kken \u2026 i forh\xE5ndsvisningen). Home Assistants egne kort bruker det ikke; dine egne card-mod-stiler kan bruke det via --theme-studio-chip-radius.","group.glass":"Glass","group.glass.hint":"Uskarpheten vises p\xE5 gjennomsiktige kort: senk dekkevnen f\xF8rst.","group.border":"Kant","group.border.hint":"Rutene viser bare kanten.","group.border-fine":"Kantfarge","group.shadow":"Skygge","group.shadow.hint":"Rutene viser bare skyggen.","group.shadow-fine":"Skyggefarge","group.bubble":"Bubble Card og popup-vinduer","group.image":"Bilde","group.overlay":"Overlegg","group.header":"Topplinje","group.font":"Skrifttype","group.font.hint":"Theme Studio laster disse skriftene i Home Assistant for deg; du trenger ikke legge dem til som ressurs. Orbitron har ingen egen \xF8/\xD8.","group.custom-font":"Din egen skrift","group.custom-font.hint":"Legg skriftfilen (.woff2, .woff, .ttf eller .otf) i /config/www/fonts/ og skriv inn /local/fonts/<fil>. Theme Studio laster den for deg.","ctl.contrast":"Kontrast","ctl.saturation":"Metning","ctl.tone":"Tone","ctl.hue_shift":"Fargeskift","ctl.accent_strength":"Aksentstyrke","ctl.neutrality":"N\xF8ytrale flater","ctl.preview_mode":"Stil","ctl.color_model":"Fargemodell","ctl.color_model.hint":"Jevn holder nyansene like lyse p\xE5 tvers av farger, s\xE5 et gult og et bl\xE5tt tema f\xF8les like.","ctl.surface_lift":"Flatenes lyshet","ctl.accent_contrast":"Aksentkontrast","ctl.accent_hue_shift":"Aksentens fargeskift","ctl.accent_saturation":"Aksentmetning","ctl.card_bg_contrast":"Kortkontrast","ctl.card_bg_hue_shift":"Kortenes fargeskift","ctl.card_bg_saturation":"Kortmetning","ctl.bubble_bg_contrast":"Bubble-kontrast","ctl.bubble_bg_hue_shift":"Bubble-fargeskift","ctl.bubble_bg_saturation":"Bubble-metning","ctl.popup_bg_contrast":"Popup-kontrast","ctl.popup_bg_hue_shift":"Popup-fargeskift","ctl.popup_bg_saturation":"Popup-metning","ctl.bubble_slider_contrast":"Kontrast for Bubble-glidebryter","ctl.bubble_slider_hue_shift":"Fargeskift for Bubble-glidebryter","ctl.bubble_slider_saturation":"Metning for Bubble-glidebryter","ctl.bubble_slider_opacity":"Dekkevne for Bubble-glidebryter","ctl.radius":"Korthj\xF8rner","ctl.chip_radius":"Chiphj\xF8rner","ctl.card_opacity":"Kortenes dekkevne","ctl.blur_strength":"Glassuskarphet","ctl.bubble_bg_opacity":"Bubble-dekkevne","ctl.popup_bg_opacity":"Popup-dekkevne","ctl.navbar_bg_opacity":"Navigasjonslinjens dekkevne","ctl.border_size":"Kantst\xF8rrelse","ctl.border_opacity":"Kantens dekkevne","ctl.border_contrast":"Kontrast","ctl.border_hue_shift":"Fargeskift","ctl.border_saturation":"Metning","ctl.shadow_size":"Skyggest\xF8rrelse","ctl.shadow_opacity":"Skyggens dekkevne","ctl.shadow_contrast":"Kontrast","ctl.shadow_hue_shift":"Fargeskift","ctl.shadow_saturation":"Metning","ctl.bubble_use_fx":"Kant og skygge p\xE5 Bubble-kort","ctl.popup_use_fx":"Kant og skygge p\xE5 popup-vinduer","ctl.background_contrast":"Bildets synlighet","ctl.background_attachment":"N\xE5r du ruller","ctl.background_attachment.hint":"St\xE5r stille holder bakgrunnen fast bak kortene. F\xF8lger siden lar den gli opp sammen med dem.","ctl.overlay_contrast":"Overleggets styrke","ctl.overlay_offset_y":"Overlegget starter fra toppen","ctl.overlay_scale":"Overleggets st\xF8rrelse","ctl.overlay_spread":"Overleggets spredning","ctl.enable_header_blend":"La topplinjen gli over i siden","ctl.header_blend_height":"Overgangens h\xF8yde","ctl.use_custom_font":"Bruk min egen skrift","ctl.custom_font_family":"Skriftens navn","ctl.custom_font_path":"Skriftfil","end.soft":"Myk","end.strong":"Sterk","end.muted":"Dempet","end.vivid":"Livlig","end.darker":"M\xF8rkere","end.lighter":"Lysere","end.tinted":"Farget","end.neutral":"N\xF8ytral","end.page_colour":"Sidefarge","end.full_image":"Hele bildet","opt.Relaxed":"Avslappet","opt.Focused":"Fokusert","opt.Vibrant":"Livlig","opt.hsl":"Klassisk","opt.oklch":"Jevn (OKLCH)","opt.fixed":"St\xE5r stille","opt.scroll":"F\xF8lger siden","border.none":"Ingen","border.soft_hairline":"H\xE5rlinje","border.glass_edge":"Glasskant","border.etched":"Etset","border.inner_glow":"Indre gl\xF8d","border.accent_line":"Aksentlinje","border.double_line":"Dobbel linje","border.bevel_edge":"Avfaset","border.glow_line":"Gl\xF8delinje","shadow.none":"Ingen","shadow.soft_depth":"Myk dybde","shadow.glass_glow":"Glassgl\xF8d","shadow.ambient_lift":"Omgivende l\xF8ft","shadow.neon_glow":"Neongl\xF8d","shadow.studio_depth":"Studiodybde","shadow.drop_shadow":"Slagskygge","shadow.soft_float":"Myk sveving","shadow.cinematic_depth":"Filmatisk","overlay.none":"Ingen","overlay.soft_veil":"Mykt sl\xF8r","overlay.mesh_glow":"Mesh-gl\xF8d","overlay.vignette":"Vignett","overlay.aurora":"Aurora","overlay.aurora_vertical":"Loddrett aurora","overlay.spotlight":"S\xF8kelys","overlay.diagonal_fade":"Diagonal overgang","overlay.topographic":"Topografisk","overlay.mist":"Dis","overlay.frost":"Frost","overlay.dual_orb":"Doble kuler","overlay.soft_stripes":"Myke striper","overlay.cinematic":"Filmatisk","overlay.halo":"Halo","font.sans-serif":"Sans-serif","font.system-ui":"System","role.page":"Sidebakgrunn","role.card":"Kort","role.bubble":"Bubble-kort","role.popup":"Popup-vinduer","role.navbar":"Navigasjonslinje","role.accent":"Aksent","role.slider":"Bubble-glidebryter","role.text":"Tekst","role.secondary":"Sekund\xE6r tekst","role.icon":"Ikoner","role.active":"Aktive ikoner","role.navicon":"Ikoner i navigasjonslinjen","role.headerbg":"Topplinjens bakgrunn","role.headertext":"Topplinjens tekst","role.secondarybg":"Sekund\xE6r bakgrunn","role.divider":"Skillelinjer","role.sidebaricon":"Ikoner i sidepanelet","role.disabled":"Deaktivert tekst","role.pick":"Velg en farge for {role}","role.mode":"Fargemodus for {role}","role.auto":"Auto","role.manual":"Manuell","role.lowest":"Lavest kontrast: {pair} (krever {minimum}:1)","pair.text_page":"Tekst p\xE5 siden","pair.text_card":"Tekst p\xE5 kort","pair.secondary_text_card":"Sekund\xE6r tekst p\xE5 kort","pair.icon_card":"Ikoner p\xE5 kort","pair.active_icon_card":"Aktive ikoner p\xE5 kort","pair.text_bubble":"Tekst p\xE5 Bubble-kort","pair.icon_bubble":"Ikoner p\xE5 Bubble-kort","pair.text_popup":"Tekst i popup-vinduer","pair.navbar_icon":"Ikoner i navigasjonslinjen","pair.header_text":"Topplinjens tekst","pair.sidebar_icon":"Ikoner i sidepanelet","pair.text_on_accent":"Tekst p\xE5 aksent (merker, chips)","pair.accent_page":"Aksent p\xE5 siden","pair.text_sub_button":"Tekst p\xE5 underknapper","base.pick":"Velg grunnfarge","base.hex":"Hex-kode","images.none":"Intet bilde","images.upload":"Last opp bilde","images.uploading":"Laster opp\u2026","images.loading":"Laster inn bilder\u2026","mirror.button":"Lag {target} fra {source}","mirror.hint":"Kopierer {source} til {target} med lysheten snudd, s\xE5 kopien forblir lesbar. Farger som bare er satt for {target}, g\xE5r tilbake til Auto. Angre henter tilbake {target} slik den var.","check.light":"Lys \xB7 {summary}","check.dark":"M\xF8rk \xB7 {summary}","check.all_readable":"alle {count} lesbare","check.some_low":"{failing} av {count} m\xE5 sjekkes","check.ratio":"{ratio}:1 \xB7 krever {minimum}:1","check.manual":"Manuell: {roles}","check.readable":"Lesbar","check.use_auto":"Bruk Auto","check.low":"Lav","check.hint":"Automatiske farger gj\xF8res alltid lesbare. Bruk Auto setter de manuelle fargene i et par tilbake til automatiske; Angre henter dem tilbake.","preview.label":"Forh\xE5ndsvisning","preview.both":"Lys + M\xF8rk","preview.size":"St\xF8rrelse p\xE5 forh\xE5ndsvisning","device.phone":"Telefon","device.tablet":"Nettbrett","device.desktop":"Datamaskin","new.title":"Nytt tema","new.sub":"Du f\xE5r en lys og en m\xF8rk variant. Alt kan endres etterp\xE5.","new.preset":"Fra et tema","new.preset_hint":"Kopier et forh\xE5ndsvalg eller et av temaene dine.","new.colour":"Fra \xE9n farge","new.colour_hint":"Velg en grunnfarge; resten regnes ut.","new.image":"Fra et bilde","new.image_hint":"Fargene kommer fra et bakgrunnsbilde.","new.import_hint":"Lim inn en delingskode eller velg en temafil.","new.start_from":"Start fra","new.mine_option":"{name} (mitt)","new.base":"Grunnfarge","new.no_images":"Ingen bilder i /config/www/background enn\xE5.","new.name":"Navn","new.placeholder":"Mitt tema","new.placeholder_preset":"Mitt {name}","new.placeholder_image":"Fra {name}","new.create":"Opprett og \xE5pne","use.title":"Bruk \xAB{name}\xBB","use.sub":"Lys og M\xF8rk h\xF8rer sammen. Home Assistant bytter mellom dem etter m\xF8rk modus p\xE5 enheten.","use.me":"Bare meg","use.me_hint":"Din profil, p\xE5 alle enhetene dine. Andre beholder sitt tema.","use.everyone":"Alle","use.everyone_hint":"Standardtemaet. Du f\xF8lger det ogs\xE5; de som har valgt sitt eget tema i profilen sin, beholder det.","use.again":"Etter flere endringer bruker du temaet p\xE5 nytt for \xE5 oppdatere det overalt der det er i bruk.","use.share":"Del","use.copy":"Kopier delingskode","use.download":"Last ned fil","use.share_hint":"Andre kan importere koden eller filen i sin Theme Studio. Den inneholder bare farger og innstillinger.","use.working":"Jobber\u2026","import.title":"Importer et tema","import.sub":"Lim inn en delingskode (TS1:\u2026) eller velg en temafil. Den blir et nytt tema; ingenting overskrives.","import.field":"Delingskode eller filinnhold","import.file":"Velg fil","import.button":"Importer og \xE5pne","delete.title":"Slette \xAB{name}\xBB?","delete.sub":"Temaet og temafilen fjernes fra Home Assistant. En sikkerhetskopi av temaet blir liggende i /config/theme_studio/user_themes.","delete.button":"Slett","toast.preview_failed":"Forh\xE5ndsvisningen mislyktes: {error}","toast.forked":"Innebygde forh\xE5ndsvalg forblir som de er. Endringene dine lagres i \xAB{name}\xBB.","toast.used_everyone":"\xAB{name}\xBB er n\xE5 temaet for alle.","toast.used_you":"\xAB{name}\xBB er n\xE5 temaet ditt.","toast.use_failed":"Kunne ikke ta i bruk temaet: {error}","toast.share_copied":"Delingskoden er kopiert. Lim den inn under Importer i en annen Theme Studio.","toast.share_blocked":"Kopiering er blokkert her; delingskoden ligger under Importer p\xE5 startsiden.","toast.downloaded":"{file} er lastet ned.","toast.share_failed":"Kunne ikke dele: {error}","toast.imported":"\xAB{name}\xBB er importert.","toast.imported_renamed":"Importert som \xAB{name}\xBB, fordi navnet var tatt.","toast.import_invalid":"Dette er ikke en delingskode eller temafil fra Theme Studio.","toast.import_failed":"Kunne ikke importere: {error}","toast.deleted":"\xAB{name}\xBB er slettet. En sikkerhetskopi blir liggende i mappen user_themes.","toast.delete_failed":"Kunne ikke slette: {error}","toast.mirrored":"{target} er n\xE5 en kopi av {source}. Angre henter den gamle tilbake.","toast.mirror_failed":"Kunne ikke kopiere: {error}","toast.created":"\xAB{name}\xBB er opprettet med en lys og en m\xF8rk variant.","toast.create_failed":"Kunne ikke opprette temaet: {error}","toast.upload_unsupported":"Opplasting krever en nyere versjon av Home Assistant-frontend.","toast.uploaded":"{file} er lastet opp og tatt i bruk.","toast.upload_failed":"Kunne ikke laste opp: {error}","toast.set_auto":"{roles} er satt til Auto.","mock.home":"Hjem","mock.sub":"Onsdag \xB7 14\xB0 ute","mock.living_room":"Stue","mock.kitchen":"Kj\xF8kken","mock.bedroom":"Soverom","mock.garden":"Hage","mock.ceiling":"Taklampe","mock.on_percent":"P\xE5 \xB7 70 %","mock.floor_lamp":"Gulvlampe","mock.off":"Av","mock.dining_table":"Spisebord","mock.heating_to":"Varmer til 22\xB0","mock.playlist":"Kveldsspilleliste","mock.speaker":"Kj\xF8kkenh\xF8yttaler","mock.front_door":"Inngangsd\xF8r","mock.locked":"L\xE5st \xB7 for 2 min siden","mock.away":"Bortemodus","tour.help":"Hjelp","tour.welcome.title":"Velkommen til Theme Studio","tour.welcome.body":"Theme Studio lager komplette temaer for Home Assistant, lyse og m\xF8rke, ut fra \xE9n farge. Hvordan vil du komme i gang?","tour.quick":"Hurtigstart","tour.quick.meta":"{count} trinn \xB7 1 minutt","tour.quick.desc":"Lag og bruk ditt f\xF8rste tema.","tour.full":"Alle funksjoner","tour.full.meta":"{count} trinn \xB7 ca. 5 minutter","tour.full.desc":"En omvisning i hver knapp og innstilling.","tour.language":"Spr\xE5k","tour.language.note":"Spr\xE5ket f\xF8lger Home Assistant. Du kan ogs\xE5 velge det her \u2013 det gjelder hele Theme Studio.","tour.skip_all":"Hopp over guiden","tour.help_later":"Du finner den alltid under ?","tour.skip":"Hopp over","tour.back":"Tilbake","tour.next":"Neste","tour.done":"Ferdig","tour.step_of":"Trinn {n} av {total}","tour.see_all":"Se alle funksjoner","tour.hint":"Guiden ligger her n\xE5r du trenger den igjen.","tour.got_it":"Skj\xF8nner","tour.chapter.quick":"Hurtigstart","tour.chapter.overview":"Oversikt","tour.chapter.top":"Topplinje","tour.chapter.colours":"Farger","tour.chapter.surfaces":"Flater","tour.chapter.background":"Bakgrunn","tour.chapter.type":"Skrift","tour.chapter.check":"Sjekk","tour.chapter.preview":"Forh\xE5ndsvisning","tour.chapter.finish":"Avslutning","tour.q.new.title":"Lag ditt f\xF8rste tema","tour.q.new.body":"Trykk p\xE5 Nytt tema. Start fra et forh\xE5ndsvalg, \xE9n farge eller et bilde \u2013 Theme Studio regner ut resten.","tour.q.base.title":"Velg grunnfargen","tour.q.base.body":"Denne ene fargen styrer hele temaet. Alt p\xE5 Auto f\xF8lger den og holdes lesbart.","tour.q.variant.title":"Lys og M\xF8rk","tour.q.variant.body":"Bytt mellom de to variantene her. De lagres hver for seg, s\xE5 Lys aldri overskriver M\xF8rk.","tour.q.check.title":"Sjekk lesbarheten","tour.q.check.body":"St\xE5r det et tall p\xE5 Sjekk, er noe tekst eller et ikon vanskelig \xE5 lese. \xC5pne den og trykk Bruk Auto for \xE5 rette det.","tour.q.preview.title":"Se det live","tour.q.preview.body":"Forh\xE5ndsvisningen oppdateres mens du endrer. Pr\xF8v telefon, nettbrett og datamaskin \u2013 eller Lys og M\xF8rk side om side.","tour.q.use.title":"Ta temaet i bruk","tour.q.use.body":"Trykk Bruk tema. Bare meg setter det i din egen profil; Alle gj\xF8r det til standardtema for hele hjemmet.","tour.q.end.title":"S\xE5nn!","tour.q.end.body":"Temaet ditt lagres automatisk. Vil du se alt Theme Studio kan? Ta hele omvisningen \u2013 eller kom tilbake til den senere med ?.","tour.f.cards.title":"Temaene dine","tour.f.cards.body":"Hvert kort viser den lyse og den m\xF8rke varianten side om side. Et merke viser om temaet er i bruk, eller om noe m\xE5 sjekkes for kontrast.","tour.f.filter.title":"Filtrer listen","tour.f.filter.body":"Vis alle temaer, bare dine egne eller bare de innebygde forh\xE5ndsvalgene.","tour.f.new.title":"Nytt tema","tour.f.new.body":"Tre m\xE5ter \xE5 starte p\xE5: kopier et forh\xE5ndsvalg eller et av temaene dine, velg \xE9n farge, eller hent fargene fra et bakgrunnsbilde.","tour.f.import.title":"Importer","tour.f.import.body":"Lim inn en delingskode (TS1:\u2026) eller velg en temafil du har f\xE5tt. Det blir alltid et nytt tema \u2013 ingenting overskrives.","tour.f.reload.title":"Last inn p\xE5 nytt","tour.f.reload.body":"Leser temafilene p\xE5 nytt, for eksempel hvis du selv har kopiert en temafil inn i /config.","tour.f.name.title":"Navn og lagring","tour.f.name.body":"Trykk p\xE5 navnet for \xE5 gi temaet nytt navn. Linjen under viser om alt er lagret \u2013 det skjer et \xF8yeblikk etter hver endring.","tour.f.undo.title":"Angre og Gj\xF8r om","tour.f.undo.body":"G\xE5 tilbake og fram gjennom endringene dine, ogs\xE5 etter at du har byttet seksjon.","tour.f.variant.title":"Lys og M\xF8rk","tour.f.variant.body":"Velg hvilken variant du redigerer. De to lagres hver for seg.","tour.f.use.title":"Bruk og del","tour.f.use.body":"Bruk tema setter det for Bare meg eller for Alle. I samme vindu kan du kopiere en delingskode eller laste ned temafilen.","tour.f.base.title":"Grunnfarge","tour.f.base.body":"Trykk p\xE5 fargefeltet for \xE5 velge en farge, eller skriv en hex-kode. Alle automatiske farger regnes ut fra den.","tour.f.adjust.title":"Juster","tour.f.adjust.body":"Kontrast, metning, tone, fargeskift, aksentstyrke og n\xF8ytrale flater finjusterer hele paletten p\xE5 \xE9n gang.","tour.f.style.title":"Stil og fargemodell","tour.f.style.body":"Stil setter den overordnede stemningen. Jevn (OKLCH) holder nyansene like lyse p\xE5 tvers av farger, s\xE5 et gult og et bl\xE5tt tema f\xF8les like.","tour.f.roles.title":"Farger i bruk","tour.f.roles.body":"Hver farge st\xE5r p\xE5 Auto eller Manuell. Velg Manuell for \xE5 bestemme fargen selv \u2013 Theme Studio endrer aldri en manuell farge.","tour.f.more.title":"Flere farger og finjustering","tour.f.more.body":"\xC5pne dem for \xE5 sette farger p\xE5 topplinje, skillelinjer og sidepanel, eller for \xE5 justere hver flate \u2013 kort, Bubble-kort og popup-vinduer \u2013 for seg.","tour.f.mirror.title":"Lag M\xF8rk fra Lys","tour.f.mirror.body":"Kopierer varianten du st\xE5r i til den andre med lysheten snudd, s\xE5 den forblir lesbar. Angre henter den gamle tilbake.","tour.f.link.title":"Lik for Lys og M\xF8rk","tour.f.link.body":"N\xE5r det er p\xE5 i Flater, Bakgrunn og Skrift, gjelder \xE9n endring begge variantene. Av endrer du bare den du st\xE5r i.","tour.f.shape.title":"Form og glass","tour.f.shape.body":"Rund av hj\xF8rnene p\xE5 kort og chips, og gj\xF8r kortene gjennomsiktige med glassuskarphet. Senk dekkevnen f\xF8rst for \xE5 se uskarpheten.","tour.f.border.title":"Kanter","tour.f.border.body":"Velg en kantstil blant rutene \u2013 de viser bare kanten \u2013 og still inn st\xF8rrelse og dekkevne. Kantfargen ligger under.","tour.f.shadow.title":"Skygger","tour.f.shadow.body":"Velg en skygge blant rutene \u2013 de viser bare skyggen \u2013 og still inn st\xF8rrelse og dekkevne. Skyggefargen ligger under.","tour.f.bubble.title":"Bubble Card og popup-vinduer","tour.f.bubble.body":"Velg om Bubble-kort og popup-vinduer skal f\xE5 samme kant og skygge som de andre kortene dine.","tour.f.image.title":"Bakgrunnsbilde","tour.f.image.body":"Velg et bilde fra /config/www/background, eller last opp ditt eget. Bildets synlighet glir mellom sidefargen og hele bildet.","tour.f.overlay.title":"Overlegg","tour.f.overlay.body":"Legg et m\xF8nster eller en lyseffekt over bakgrunnen, og still inn styrke, start, st\xF8rrelse og spredning.","tour.f.header.title":"Overgang i topplinjen","tour.f.header.body":"Lar toppen av siden gli over i bakgrunnen, s\xE5 topplinjen smelter sammen med den. H\xF8yden bestemmer hvor langt ned det g\xE5r.","tour.f.scroll.title":"N\xE5r du ruller","tour.f.scroll.body":"St\xE5r stille holder bakgrunnen fast bak kortene. F\xF8lger siden lar den gli opp sammen med dem.","tour.f.fonts.title":"Skrifttyper","tour.f.fonts.body":"Velg skrifttypen for dashbordene dine. Theme Studio laster skriftene i Home Assistant for deg \u2013 ingenting \xE5 installere.","tour.f.ownfont.title":"Din egen skrift","tour.f.ownfont.body":"Legg en skriftfil i /config/www/fonts/, sl\xE5 p\xE5 Bruk min egen skrift og skriv inn navn og sti.","tour.f.check.title":"Kontrastsjekk","tour.f.check.body":"All tekst og alle ikoner m\xE5les mot det de st\xE5r p\xE5. Bruk Auto setter de manuelle fargene i et svakt par tilbake til automatiske.","tour.f.preview.title":"Forh\xE5ndsvisning","tour.f.preview.body":"Se temaet p\xE5 telefon, nettbrett eller datamaskin \u2013 eller Lys og M\xF8rk side om side. Den oppdateres mens du jobber.","tour.f.delete.title":"Slett et tema","tour.f.delete.body":"P\xE5 dine egne temaer ligger Slett tema nederst i hver seksjon. Det lagres en sikkerhetskopi, og innebygde forh\xE5ndsvalg kan ikke slettes.","tour.f.end.title":"N\xE5 kan du alt","tour.f.end.body":"Det var alle funksjonene. Start omvisningen igjen n\xE5r som helst med ?, eller velg Hurtigstart for den korte versjonen."};var dt={"common.loading":"L\xE4ser in\u2026","common.try_again":"F\xF6rs\xF6k igen","common.close":"St\xE4ng","common.cancel":"Avbryt","error.name_taken":"Det namnet anv\xE4nds redan av ett annat tema.","error.unauthorized":"Bara administrat\xF6rer kan \xE4ndra teman.","error.unknown":"ok\xE4nt fel","upload.not_an_image":"Den filen \xE4r ingen bild.","upload.unsupported_format":"Anv\xE4nd en PNG-, JPEG-, WebP- eller GIF-bild.","upload.too_large":"Bilden \xE4r st\xF6rre \xE4n 15 MB.","lib.themes_count":"{count} teman \xB7 ljust och m\xF6rkt","lib.tagline":"Teman f\xF6r Home Assistant","lib.reload":"L\xE4s in teman igen","lib.import":"Importera","lib.import_label":"Importera ett tema","lib.new_theme":"Nytt tema","lib.title":"Dina teman","lib.sub":"\xD6ppna ett tema f\xF6r att \xE4ndra det. Inbyggda f\xF6rinst\xE4llningar kopieras f\xF6rsta g\xE5ngen du \xE4ndrar dem, s\xE5 de alltid f\xF6rblir som de \xE4r.","lib.filter":"Visa","lib.all":"Alla","lib.mine":"Mina","lib.builtin":"Inbyggda","lib.group_mine":"Mina","lib.group_builtin":"Inbyggda f\xF6rinst\xE4llningar","lib.load_failed":"Kunde inte l\xE4sa in temana","lib.loading":"L\xE4ser in teman\u2026","lib.open":"\xD6ppna {name}","lib.card_builtin":"Inbyggd f\xF6rinst\xE4llning","lib.card_mine":"Mitt","lib.to_check":"{count} att kontrollera","lib.in_use_everyone":"Anv\xE4nds \xB7 alla","lib.in_use_you":"Anv\xE4nds \xB7 du","status.view_only":"Endast visning \xB7 be en administrat\xF6r att \xE4ndra teman","status.builtin":"Inbyggd f\xF6rinst\xE4llning \xB7 din f\xF6rsta \xE4ndring skapar en kopia","status.saving":"Sparar\u2026","status.unsaved":"Osparade \xE4ndringar","status.error":"Inte sparat: {error}","status.saved":"Alla \xE4ndringar sparade","editor.back":"Tillbaka till alla teman","editor.name":"Temats namn","editor.undo":"\xC5ngra","editor.redo":"G\xF6r om","editor.variant":"Variant att redigera","editor.use":"Anv\xE4nd tema","editor.load_failed":"Kunde inte l\xE4sa in {name}","editor.not_built":"Det gick inte att bygga det h\xE4r temat.","editor.sections":"Avsnitt","editor.controls":"Inst\xE4llningar","editor.builtin_banner":"Det h\xE4r \xE4r en inbyggd f\xF6rinst\xE4llning. \xC4ndrar du n\xE5got skapar Theme Studio en egen kopia; sj\xE4lva f\xF6rinst\xE4llningen f\xF6rblir or\xF6rd.","editor.delete":"Ta bort tema","editor.copy_name":"{name} (kopia)","variant.light":"Ljust","variant.dark":"M\xF6rkt","link.title":"Samma f\xF6r Ljust och M\xF6rkt","link.on":"\xC4ndringar h\xE4r g\xE4ller b\xE5da varianterna.","link.off":"\xC4ndringar h\xE4r g\xE4ller bara {variant}.","section.colours":"F\xE4rger","section.colours.description":"B\xF6rja med en grundf\xE4rg. Allt som st\xE5r p\xE5 Auto r\xE4knas fram fr\xE5n den och h\xE5lls l\xE4sbart.","section.surfaces":"Ytor","section.surfaces.description":"Form, glas, kanter och skuggor p\xE5 kort, Bubble-kort och popup-f\xF6nster.","section.background":"Bakgrund","section.background.description":"En enf\xE4rgad sida eller en bild bakom dina instrumentpaneler. Sidf\xE4rgen finns under F\xE4rger.","section.type":"Typsnitt","section.type.description":"Typsnittet dina instrumentpaneler anv\xE4nder.","section.check":"Kontroll","section.check.description":"All text och alla ikoner m\xE4tta mot det de ligger p\xE5.","group.base":"Grundf\xE4rg","group.adjust":"Justera","group.roles":"F\xE4rger som anv\xE4nds","group.roles.hint":"Manuella f\xE4rger \xE4ndras aldrig av Theme Studio. Tryck p\xE5 en manuell f\xE4rgruta f\xF6r att v\xE4lja en f\xE4rg.","group.more":"Fler f\xE4rger","group.finetune":"Finjustera varje yta","group.mirror":"Ljust och M\xF6rkt","group.shape":"Form","group.shape.hint":"Chiph\xF6rn rundar av de sm\xE5 pillerformade knapparna (Vardagsrum, K\xF6k \u2026 i f\xF6rhandsvisningen). Home Assistants egna kort anv\xE4nder det inte; dina egna card-mod-stilar kan anv\xE4nda det via --theme-studio-chip-radius.","group.glass":"Glas","group.glass.hint":"Osk\xE4rpan syns p\xE5 genomskinliga kort: s\xE4nk opaciteten f\xF6rst.","group.border":"Kant","group.border.hint":"Rutorna visar bara kanten.","group.border-fine":"Kantf\xE4rg","group.shadow":"Skugga","group.shadow.hint":"Rutorna visar bara skuggan.","group.shadow-fine":"Skuggf\xE4rg","group.bubble":"Bubble Card och popup-f\xF6nster","group.image":"Bild","group.overlay":"\xD6verl\xE4gg","group.header":"Sidhuvud","group.font":"Typsnitt","group.font.hint":"Theme Studio laddar de h\xE4r typsnitten i Home Assistant \xE5t dig; inget att l\xE4gga till som resurs. Orbitron har inget eget \xF8/\xD8.","group.custom-font":"Ditt eget typsnitt","group.custom-font.hint":"L\xE4gg typsnittsfilen (.woff2, .woff, .ttf eller .otf) i /config/www/fonts/ och ange /local/fonts/<fil>. Theme Studio laddar den \xE5t dig.","ctl.contrast":"Kontrast","ctl.saturation":"M\xE4ttnad","ctl.tone":"Ton","ctl.hue_shift":"Nyansskifte","ctl.accent_strength":"Accentstyrka","ctl.neutrality":"Neutrala ytor","ctl.preview_mode":"Stil","ctl.color_model":"F\xE4rgmodell","ctl.color_model.hint":"J\xE4mn h\xE5ller nyanserna lika ljusa \xF6ver alla f\xE4rger, s\xE5 ett gult och ett bl\xE5tt tema k\xE4nns likadana.","ctl.surface_lift":"Ytornas ljushet","ctl.accent_contrast":"Accentkontrast","ctl.accent_hue_shift":"Accentens nyansskifte","ctl.accent_saturation":"Accentm\xE4ttnad","ctl.card_bg_contrast":"Kortkontrast","ctl.card_bg_hue_shift":"Kortens nyansskifte","ctl.card_bg_saturation":"Kortm\xE4ttnad","ctl.bubble_bg_contrast":"Bubble-kontrast","ctl.bubble_bg_hue_shift":"Bubble-nyansskifte","ctl.bubble_bg_saturation":"Bubble-m\xE4ttnad","ctl.popup_bg_contrast":"Popup-kontrast","ctl.popup_bg_hue_shift":"Popup-nyansskifte","ctl.popup_bg_saturation":"Popup-m\xE4ttnad","ctl.bubble_slider_contrast":"Bubble-reglagets kontrast","ctl.bubble_slider_hue_shift":"Bubble-reglagets nyansskifte","ctl.bubble_slider_saturation":"Bubble-reglagets m\xE4ttnad","ctl.bubble_slider_opacity":"Bubble-reglagets opacitet","ctl.radius":"Korth\xF6rn","ctl.chip_radius":"Chiph\xF6rn","ctl.card_opacity":"Kortens opacitet","ctl.blur_strength":"Glasosk\xE4rpa","ctl.bubble_bg_opacity":"Bubble-opacitet","ctl.popup_bg_opacity":"Popup-opacitet","ctl.navbar_bg_opacity":"Navigeringsf\xE4ltets opacitet","ctl.border_size":"Kantstorlek","ctl.border_opacity":"Kantens opacitet","ctl.border_contrast":"Kontrast","ctl.border_hue_shift":"Nyansskifte","ctl.border_saturation":"M\xE4ttnad","ctl.shadow_size":"Skuggstorlek","ctl.shadow_opacity":"Skuggans opacitet","ctl.shadow_contrast":"Kontrast","ctl.shadow_hue_shift":"Nyansskifte","ctl.shadow_saturation":"M\xE4ttnad","ctl.bubble_use_fx":"Kant och skugga p\xE5 Bubble-kort","ctl.popup_use_fx":"Kant och skugga p\xE5 popup-f\xF6nster","ctl.background_contrast":"Bildens synlighet","ctl.background_attachment":"N\xE4r du scrollar","ctl.background_attachment.hint":"St\xE5r still h\xE5ller bakgrunden fast bakom korten. F\xF6ljer sidan l\xE5ter den glida upp tillsammans med dem.","ctl.overlay_contrast":"\xD6verl\xE4ggets styrka","ctl.overlay_offset_y":"\xD6verl\xE4gget b\xF6rjar uppifr\xE5n","ctl.overlay_scale":"\xD6verl\xE4ggets storlek","ctl.overlay_spread":"\xD6verl\xE4ggets spridning","ctl.enable_header_blend":"Tona in sidhuvudet i sidan","ctl.header_blend_height":"\xD6verg\xE5ngens h\xF6jd","ctl.use_custom_font":"Anv\xE4nd mitt eget typsnitt","ctl.custom_font_family":"Typsnittets namn","ctl.custom_font_path":"Typsnittsfil","end.soft":"Mjuk","end.strong":"Stark","end.muted":"D\xE4mpad","end.vivid":"Livfull","end.darker":"M\xF6rkare","end.lighter":"Ljusare","end.tinted":"Tonad","end.neutral":"Neutral","end.page_colour":"Sidf\xE4rg","end.full_image":"Hela bilden","opt.Relaxed":"Avslappnad","opt.Focused":"Fokuserad","opt.Vibrant":"Livfull","opt.hsl":"Klassisk","opt.oklch":"J\xE4mn (OKLCH)","opt.fixed":"St\xE5r still","opt.scroll":"F\xF6ljer sidan","border.none":"Ingen","border.soft_hairline":"H\xE5rlinje","border.glass_edge":"Glaskant","border.etched":"Etsad","border.inner_glow":"Inre gl\xF6d","border.accent_line":"Accentlinje","border.double_line":"Dubbellinje","border.bevel_edge":"Fasad","border.glow_line":"Gl\xF6dlinje","shadow.none":"Ingen","shadow.soft_depth":"Mjukt djup","shadow.glass_glow":"Glasgl\xF6d","shadow.ambient_lift":"Sv\xE4vande lyft","shadow.neon_glow":"Neongl\xF6d","shadow.studio_depth":"Studiodjup","shadow.drop_shadow":"Slagskugga","shadow.soft_float":"Mjuk sv\xE4vning","shadow.cinematic_depth":"Filmisk","overlay.none":"Inget","overlay.soft_veil":"Mjuk sl\xF6ja","overlay.mesh_glow":"Mesh-gl\xF6d","overlay.vignette":"Vinjett","overlay.aurora":"Aurora","overlay.aurora_vertical":"Aurora vertikal","overlay.spotlight":"Str\xE5lkastare","overlay.diagonal_fade":"Diagonal tonning","overlay.topographic":"Topografisk","overlay.mist":"Dimma","overlay.frost":"Frost","overlay.dual_orb":"Dubbla klot","overlay.soft_stripes":"Mjuka r\xE4nder","overlay.cinematic":"Filmisk","overlay.halo":"Halo","font.sans-serif":"Sans-serif","font.system-ui":"System","role.page":"Sidbakgrund","role.card":"Kort","role.bubble":"Bubble-kort","role.popup":"Popup-f\xF6nster","role.navbar":"Navigeringsf\xE4lt","role.accent":"Accent","role.slider":"Bubble-reglage","role.text":"Text","role.secondary":"Sekund\xE4r text","role.icon":"Ikoner","role.active":"Aktiva ikoner","role.navicon":"Ikoner i navigeringsf\xE4ltet","role.headerbg":"Sidhuvudets bakgrund","role.headertext":"Sidhuvudets text","role.secondarybg":"Sekund\xE4r bakgrund","role.divider":"Avdelare","role.sidebaricon":"Ikoner i sidof\xE4ltet","role.disabled":"Inaktiverad text","role.pick":"V\xE4lj en f\xE4rg f\xF6r {role}","role.mode":"F\xE4rgl\xE4ge f\xF6r {role}","role.auto":"Auto","role.manual":"Manuell","role.lowest":"L\xE4gsta kontrast: {pair} (kr\xE4ver {minimum}:1)","pair.text_page":"Text p\xE5 sidan","pair.text_card":"Text p\xE5 kort","pair.secondary_text_card":"Sekund\xE4r text p\xE5 kort","pair.icon_card":"Ikoner p\xE5 kort","pair.active_icon_card":"Aktiva ikoner p\xE5 kort","pair.text_bubble":"Text p\xE5 Bubble-kort","pair.icon_bubble":"Ikoner p\xE5 Bubble-kort","pair.text_popup":"Text i popup-f\xF6nster","pair.navbar_icon":"Ikoner i navigeringsf\xE4ltet","pair.header_text":"Sidhuvudets text","pair.sidebar_icon":"Ikoner i sidof\xE4ltet","pair.text_on_accent":"Text p\xE5 accent (etiketter, chips)","pair.accent_page":"Accent p\xE5 sidan","pair.text_sub_button":"Text p\xE5 underknappar","base.pick":"V\xE4lj grundf\xE4rg","base.hex":"Hexkod","images.none":"Ingen bild","images.upload":"Ladda upp bild","images.uploading":"Laddar upp\u2026","images.loading":"L\xE4ser in bilder\u2026","mirror.button":"G\xF6r {target} av {source}","mirror.hint":"Kopierar {source} till {target} med ljusheten omv\xE4nd, s\xE5 att kopian f\xF6rblir l\xE4sbar. F\xE4rger som bara \xE4r satta f\xF6r {target} g\xE5r tillbaka till Auto. \xC5ngra h\xE4mtar tillbaka det tidigare {target}.","check.light":"Ljust \xB7 {summary}","check.dark":"M\xF6rkt \xB7 {summary}","check.all_readable":"alla {count} l\xE4sbara","check.some_low":"{failing} av {count} att kontrollera","check.ratio":"{ratio}:1 \xB7 kr\xE4ver {minimum}:1","check.manual":"Manuella: {roles}","check.readable":"L\xE4sbar","check.use_auto":"Anv\xE4nd Auto","check.low":"L\xE5g","check.hint":"Automatiska f\xE4rger g\xF6rs alltid l\xE4sbara. Anv\xE4nd Auto s\xE4tter de manuella f\xE4rgerna i ett par tillbaka till automatiska; \xC5ngra h\xE4mtar tillbaka dem.","preview.label":"F\xF6rhandsvisning","preview.both":"Ljust + M\xF6rkt","preview.size":"Storlek","device.phone":"Telefon","device.tablet":"Surfplatta","device.desktop":"Dator","new.title":"Nytt tema","new.sub":"Du f\xE5r en ljus och en m\xF6rk variant. Allt kan \xE4ndras efter\xE5t.","new.preset":"Fr\xE5n ett tema","new.preset_hint":"Kopiera en f\xF6rinst\xE4llning eller ett av dina teman.","new.colour":"Fr\xE5n en f\xE4rg","new.colour_hint":"V\xE4lj en grundf\xE4rg; resten r\xE4knas ut.","new.image":"Fr\xE5n en bild","new.image_hint":"F\xE4rgerna kommer fr\xE5n en bakgrundsbild.","new.import_hint":"Klistra in en delningskod eller v\xE4lj en temafil.","new.start_from":"Utg\xE5 fr\xE5n","new.mine_option":"{name} (mitt)","new.base":"Grundf\xE4rg","new.no_images":"Inga bilder i /config/www/background \xE4n.","new.name":"Namn","new.placeholder":"Mitt tema","new.placeholder_preset":"Mitt {name}","new.placeholder_image":"Fr\xE5n {name}","new.create":"Skapa och \xF6ppna","use.title":"Anv\xE4nd \u201D{name}\u201D","use.sub":"Ljust och M\xF6rkt h\xF6r ihop. Home Assistant v\xE4xlar mellan dem efter enhetens m\xF6rka l\xE4ge.","use.me":"Bara jag","use.me_hint":"Din profil, p\xE5 alla dina enheter. Andra beh\xE5ller sitt tema.","use.everyone":"Alla","use.everyone_hint":"Standardtemat. Du f\xF6ljer det ocks\xE5; den som har valt ett eget tema i sin profil beh\xE5ller det.","use.again":"Efter fler \xE4ndringar anv\xE4nder du temat igen f\xF6r att uppdatera det \xF6verallt d\xE4r det anv\xE4nds.","use.share":"Dela","use.copy":"Kopiera delningskod","use.download":"Ladda ner fil","use.share_hint":"Andra kan importera koden eller filen i sin Theme Studio. Den inneh\xE5ller bara f\xE4rger och inst\xE4llningar.","use.working":"Arbetar\u2026","import.title":"Importera ett tema","import.sub":"Klistra in en delningskod (TS1:\u2026) eller v\xE4lj en temafil. Det blir ett nytt tema; inget skrivs \xF6ver.","import.field":"Delningskod eller filinneh\xE5ll","import.file":"V\xE4lj fil","import.button":"Importera och \xF6ppna","delete.title":"Ta bort \u201D{name}\u201D?","delete.sub":"Temat och dess temafil tas bort fr\xE5n Home Assistant. En s\xE4kerhetskopia av temat finns kvar i /config/theme_studio/user_themes.","delete.button":"Ta bort","toast.preview_failed":"F\xF6rhandsvisningen misslyckades: {error}","toast.forked":"Inbyggda f\xF6rinst\xE4llningar f\xF6rblir som de \xE4r. Dina \xE4ndringar sparas i \u201D{name}\u201D.","toast.used_everyone":"\u201D{name}\u201D \xE4r nu temat f\xF6r alla.","toast.used_you":"\u201D{name}\u201D \xE4r nu ditt tema.","toast.use_failed":"Kunde inte anv\xE4nda temat: {error}","toast.share_copied":"Delningskoden har kopierats. Klistra in den under Importera i en annan Theme Studio.","toast.share_blocked":"Kopiering \xE4r blockerad h\xE4r; delningskoden finns under Importera p\xE5 startsidan.","toast.downloaded":"{file} har laddats ner.","toast.share_failed":"Kunde inte dela: {error}","toast.imported":"\u201D{name}\u201D har importerats.","toast.imported_renamed":"Importerat som \u201D{name}\u201D, eftersom namnet var upptaget.","toast.import_invalid":"Det \xE4r ingen delningskod eller temafil fr\xE5n Theme Studio.","toast.import_failed":"Kunde inte importera: {error}","toast.deleted":"\u201D{name}\u201D har tagits bort. En s\xE4kerhetskopia finns kvar i mappen user_themes.","toast.delete_failed":"Kunde inte ta bort: {error}","toast.mirrored":"{target} \xE4r nu en kopia av {source}. \xC5ngra h\xE4mtar tillbaka det tidigare.","toast.mirror_failed":"Kunde inte kopiera: {error}","toast.created":"\u201D{name}\u201D har skapats med en ljus och en m\xF6rk variant.","toast.create_failed":"Kunde inte skapa temat: {error}","toast.upload_unsupported":"Uppladdning kr\xE4ver ett nyare Home Assistant-gr\xE4nssnitt.","toast.uploaded":"{file} har laddats upp och anv\xE4nds.","toast.upload_failed":"Kunde inte ladda upp: {error}","toast.set_auto":"{roles} har satts till Auto.","mock.home":"Hem","mock.sub":"Onsdag \xB7 14\xB0 ute","mock.living_room":"Vardagsrum","mock.kitchen":"K\xF6k","mock.bedroom":"Sovrum","mock.garden":"Tr\xE4dg\xE5rd","mock.ceiling":"Taklampa","mock.on_percent":"P\xE5 \xB7 70 %","mock.floor_lamp":"Golvlampa","mock.off":"Av","mock.dining_table":"Matbord","mock.heating_to":"V\xE4rmer till 22\xB0","mock.playlist":"Kv\xE4llsspellista","mock.speaker":"K\xF6ksh\xF6gtalare","mock.front_door":"Ytterd\xF6rr","mock.locked":"L\xE5st \xB7 f\xF6r 2 min sedan","mock.away":"Bortal\xE4ge","tour.help":"Hj\xE4lp","tour.welcome.title":"V\xE4lkommen till Theme Studio","tour.welcome.body":"Theme Studio skapar kompletta teman f\xF6r Home Assistant, ljusa och m\xF6rka, utifr\xE5n en enda f\xE4rg. Hur vill du b\xF6rja?","tour.quick":"Snabbstart","tour.quick.meta":"{count} steg \xB7 1 minut","tour.quick.desc":"Skapa och anv\xE4nd ditt f\xF6rsta tema.","tour.full":"Alla funktioner","tour.full.meta":"{count} steg \xB7 ca. 5 minuter","tour.full.desc":"En rundtur genom varje knapp och inst\xE4llning.","tour.language":"Spr\xE5k","tour.language.note":"Spr\xE5ket f\xF6ljer din Home Assistant. Du kan ocks\xE5 v\xE4lja det h\xE4r \u2013 det g\xE4ller hela Theme Studio.","tour.skip_all":"Hoppa \xF6ver guiden","tour.help_later":"Du hittar den alltid under ?","tour.skip":"Hoppa \xF6ver","tour.back":"Tillbaka","tour.next":"N\xE4sta","tour.done":"Klar","tour.step_of":"Steg {n} av {total}","tour.see_all":"Se alla funktioner","tour.hint":"Guiden finns h\xE4r n\xE4r du beh\xF6ver den igen.","tour.got_it":"Uppfattat","tour.chapter.quick":"Snabbstart","tour.chapter.overview":"\xD6versikt","tour.chapter.top":"\xD6versta raden","tour.chapter.colours":"F\xE4rger","tour.chapter.surfaces":"Ytor","tour.chapter.background":"Bakgrund","tour.chapter.type":"Typsnitt","tour.chapter.check":"Kontroll","tour.chapter.preview":"F\xF6rhandsvisning","tour.chapter.finish":"Avslutning","tour.q.new.title":"Skapa ditt f\xF6rsta tema","tour.q.new.body":"Tryck p\xE5 Nytt tema. B\xF6rja fr\xE5n en f\xF6rinst\xE4llning, en enda f\xE4rg eller en bild \u2013 Theme Studio r\xE4knar ut resten.","tour.q.base.title":"V\xE4lj grundf\xE4rgen","tour.q.base.body":"Den h\xE4r enda f\xE4rgen styr hela temat. Allt p\xE5 Auto f\xF6ljer den och h\xE5lls l\xE4sbart.","tour.q.variant.title":"Ljust och M\xF6rkt","tour.q.variant.body":"V\xE4xla mellan de tv\xE5 varianterna h\xE4r. De sparas var f\xF6r sig, s\xE5 Ljust skriver aldrig \xF6ver M\xF6rkt.","tour.q.check.title":"Kontrollera l\xE4sbarheten","tour.q.check.body":"St\xE5r det en siffra p\xE5 Kontroll \xE4r n\xE5gon text eller ikon sv\xE5rl\xE4st. \xD6ppna den och tryck Anv\xE4nd Auto f\xF6r att r\xE4tta det.","tour.q.preview.title":"Se det live","tour.q.preview.body":"F\xF6rhandsvisningen uppdateras medan du \xE4ndrar. Prova telefon, surfplatta och dator \u2013 eller Ljust och M\xF6rkt sida vid sida.","tour.q.use.title":"Anv\xE4nd temat","tour.q.use.body":"Tryck Anv\xE4nd tema. Bara jag s\xE4tter det i din egen profil; Alla g\xF6r det till standardtema f\xF6r hela hemmet.","tour.q.end.title":"Klart!","tour.q.end.body":"Ditt tema sparas automatiskt. Vill du se allt Theme Studio kan? Ta hela rundturen \u2013 eller kom tillbaka till den senare med ?.","tour.f.cards.title":"Dina teman","tour.f.cards.body":"Varje kort visar den ljusa och den m\xF6rka varianten sida vid sida. En etikett visar om temat anv\xE4nds eller om n\xE5got beh\xF6ver en kontrastkontroll.","tour.f.filter.title":"Filtrera listan","tour.f.filter.body":"Visa alla teman, bara dina egna eller bara de inbyggda f\xF6rinst\xE4llningarna.","tour.f.new.title":"Nytt tema","tour.f.new.body":"Tre s\xE4tt att b\xF6rja: kopiera en f\xF6rinst\xE4llning eller ett av dina teman, v\xE4lj en f\xE4rg, eller h\xE4mta f\xE4rgerna fr\xE5n en bakgrundsbild.","tour.f.import.title":"Importera","tour.f.import.body":"Klistra in en delningskod (TS1:\u2026) eller v\xE4lj en temafil du har f\xE5tt. Det blir alltid ett nytt tema \u2013 inget skrivs \xF6ver.","tour.f.reload.title":"L\xE4s in igen","tour.f.reload.body":"L\xE4ser temafilerna p\xE5 nytt, till exempel om du sj\xE4lv har kopierat in en temafil i /config.","tour.f.name.title":"Namn och sparande","tour.f.name.body":"Tryck p\xE5 namnet f\xF6r att byta namn p\xE5 temat. Raden under visar om allt \xE4r sparat \u2013 det sker strax efter varje \xE4ndring.","tour.f.undo.title":"\xC5ngra och G\xF6r om","tour.f.undo.body":"G\xE5 bak\xE5t och fram\xE5t genom dina \xE4ndringar, \xE4ven efter att du bytt avsnitt.","tour.f.variant.title":"Ljust och M\xF6rkt","tour.f.variant.body":"V\xE4lj vilken variant du redigerar. De tv\xE5 sparas var f\xF6r sig.","tour.f.use.title":"Anv\xE4nd och dela","tour.f.use.body":"Anv\xE4nd tema s\xE4tter det f\xF6r Bara jag eller f\xF6r Alla. I samma f\xF6nster kan du kopiera en delningskod eller ladda ner temafilen.","tour.f.base.title":"Grundf\xE4rg","tour.f.base.body":"Tryck p\xE5 f\xE4rgrutan f\xF6r att v\xE4lja en f\xE4rg, eller skriv en hexkod. Alla automatiska f\xE4rger r\xE4knas fram fr\xE5n den.","tour.f.adjust.title":"Justera","tour.f.adjust.body":"Kontrast, m\xE4ttnad, ton, nyansskifte, accentstyrka och neutrala ytor finjusterar hela paletten p\xE5 en g\xE5ng.","tour.f.style.title":"Stil och f\xE4rgmodell","tour.f.style.body":"Stil s\xE4tter den \xF6vergripande k\xE4nslan. J\xE4mn (OKLCH) h\xE5ller nyanserna lika ljusa \xF6ver alla f\xE4rger, s\xE5 ett gult och ett bl\xE5tt tema k\xE4nns likadana.","tour.f.roles.title":"F\xE4rger som anv\xE4nds","tour.f.roles.body":"Varje f\xE4rg st\xE5r p\xE5 Auto eller Manuell. V\xE4lj Manuell f\xF6r att best\xE4mma f\xE4rgen sj\xE4lv \u2013 Theme Studio \xE4ndrar aldrig en manuell f\xE4rg.","tour.f.more.title":"Fler f\xE4rger och finjustering","tour.f.more.body":"\xD6ppna dem f\xF6r att s\xE4tta f\xE4rger p\xE5 sidhuvud, avdelare och sidof\xE4lt, eller f\xF6r att justera varje yta \u2013 kort, Bubble-kort och popup-f\xF6nster \u2013 f\xF6r sig.","tour.f.mirror.title":"G\xF6r M\xF6rkt av Ljust","tour.f.mirror.body":"Kopierar varianten du st\xE5r i till den andra med ljusheten omv\xE4nd, s\xE5 den f\xF6rblir l\xE4sbar. \xC5ngra h\xE4mtar tillbaka den gamla.","tour.f.link.title":"Samma f\xF6r Ljust och M\xF6rkt","tour.f.link.body":"N\xE4r det \xE4r p\xE5 i Ytor, Bakgrund och Typsnitt g\xE4ller en \xE4ndring b\xE5da varianterna. Avst\xE4ngt \xE4ndrar du bara den du st\xE5r i.","tour.f.shape.title":"Form och glas","tour.f.shape.body":"Runda av h\xF6rnen p\xE5 kort och chips, och g\xF6r korten genomskinliga med glasosk\xE4rpa. S\xE4nk opaciteten f\xF6rst f\xF6r att se osk\xE4rpan.","tour.f.border.title":"Kanter","tour.f.border.body":"V\xE4lj en kantstil bland rutorna \u2013 de visar bara kanten \u2013 och st\xE4ll in storlek och opacitet. Kantf\xE4rgen finns under.","tour.f.shadow.title":"Skuggor","tour.f.shadow.body":"V\xE4lj en skugga bland rutorna \u2013 de visar bara skuggan \u2013 och st\xE4ll in storlek och opacitet. Skuggf\xE4rgen finns under.","tour.f.bubble.title":"Bubble Card och popup-f\xF6nster","tour.f.bubble.body":"V\xE4lj om Bubble-kort och popup-f\xF6nster f\xE5r samma kant och skugga som dina andra kort.","tour.f.image.title":"Bakgrundsbild","tour.f.image.body":"V\xE4lj en bild fr\xE5n /config/www/background eller ladda upp din egen. Bildens synlighet glider mellan sidf\xE4rgen och hela bilden.","tour.f.overlay.title":"\xD6verl\xE4gg","tour.f.overlay.body":"L\xE4gg ett m\xF6nster eller en ljuseffekt \xF6ver bakgrunden, och st\xE4ll in styrka, start, storlek och spridning.","tour.f.header.title":"\xD6verg\xE5ng i sidhuvudet","tour.f.header.body":"L\xE5ter toppen av sidan tona \xF6ver i bakgrunden s\xE5 att sidhuvudet sm\xE4lter ihop med den. \xD6verg\xE5ngens h\xF6jd styr hur l\xE5ngt ner det g\xE5r.","tour.f.scroll.title":"N\xE4r du scrollar","tour.f.scroll.body":"St\xE5r still h\xE5ller bakgrunden fast bakom korten. F\xF6ljer sidan l\xE5ter den glida upp tillsammans med dem.","tour.f.fonts.title":"Typsnitt","tour.f.fonts.body":"V\xE4lj typsnitt f\xF6r dina instrumentpaneler. Theme Studio laddar typsnitten i Home Assistant \xE5t dig \u2013 inget att installera.","tour.f.ownfont.title":"Ditt eget typsnitt","tour.f.ownfont.body":"L\xE4gg en typsnittsfil i /config/www/fonts/, sl\xE5 p\xE5 Anv\xE4nd mitt eget typsnitt och ange namn och s\xF6kv\xE4g.","tour.f.check.title":"Kontrastkontroll","tour.f.check.body":"All text och alla ikoner m\xE4ts mot det de ligger p\xE5. Anv\xE4nd Auto s\xE4tter de manuella f\xE4rgerna i ett svagt par tillbaka till automatiska.","tour.f.preview.title":"F\xF6rhandsvisning","tour.f.preview.body":"Se temat p\xE5 telefon, surfplatta eller dator \u2013 eller Ljust och M\xF6rkt sida vid sida. Den uppdateras medan du arbetar.","tour.f.delete.title":"Ta bort ett tema","tour.f.delete.body":"P\xE5 dina egna teman finns Ta bort tema l\xE4ngst ner i varje avsnitt. En s\xE4kerhetskopia sparas, och inbyggda f\xF6rinst\xE4llningar kan inte tas bort.","tour.f.end.title":"Nu kan du allt","tour.f.end.body":"Det var alla funktioner. Starta rundturen igen n\xE4r som helst med ?, eller v\xE4lj Snabbstart f\xF6r den korta versionen."};var ut=[{code:"da",label:"Dansk"},{code:"de",label:"Deutsch"},{code:"en",label:"English"},{code:"es",label:"Espa\xF1ol"},{code:"fr",label:"Fran\xE7ais"},{code:"nb",label:"Norsk"},{code:"sv",label:"Svenska"}],re={da:at,de:it,en:ot,es:nt,fr:st,nb:lt,sv:dt},ct="en";function U(n){return typeof n=="string"&&n in re}function pt(n){let r=(n??"").toLowerCase().split(/[-_]/)[0];return r==="no"||r==="nn"?"nb":U(r)?r:"en"}function ht(n){ct=n}function f(n,r){return n in re.en?a(n):r}function a(n,r){let e=re[ct][n]??re.en[n]??n;return r?e.replace(/\{([a-z_]+)\}/g,(t,i)=>i in r?String(r[i]):t):e}var Xt={palette:"M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M15 7.8h.01",back:"m15 18-6-6 6-6",refresh:"M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4",help:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8h.01",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",sun:"M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",split:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM12 4v16",phone:"M9.5 2.5h5A2.5 2.5 0 0 1 17 5v14a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 19V5a2.5 2.5 0 0 1 2.5-2.5zM11 18h2",tablet:"M6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3zM11 18h2",desktop:"M4.5 4h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 21h8M12 17v4",bulb:"M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",thermo:"M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",home:"M3 11 12 4l9 7M5 10v10h14V10",image:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-9 9",lock:"M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3",edit:"M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",contrast:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18M12 7h4.5M12 11h6M12 15h5.5",plus:"M12 5v14M5 12h14",grid:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",layers:"M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5",type:"M4 7V5h16v2M12 5v14M9 19h6",trash:"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",undo:"M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",redo:"m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",upload:"M12 15V4M7 9l5-5 5 5M5 20h14",download:"M12 4v11M7 10l5 5 5-5M5 20h14",copy:"M9 9h10v11H9zM5 15V4h10",swap:"M7 7h11l-3-3M17 17H6l3 3",check:"m5 12 5 5 9-10",close:"M6 6l12 12M18 6 6 18",chevron:"m6 9 6 6 6-6",wand:"m4 20 11-11M14 3l1 2.2 2.2 1-2.2 1L14 9.4l-1-2.2-2.2-1 2.2-1z"};function p(n,r=20){return l`<svg
    width=${r}
    height=${r}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${ve`<path d=${Xt[n]}></path>`}
  </svg>`}function mt(n=16){return l`<svg width=${n} height=${n} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    ${ve`<path d="M8 5v14l11-7z"></path>`}
  </svg>`}function gt(n=!1){return l`
    <div class="mock ${n?"scrolls":""}">
      <div class="m-scroll">
        <div class="m-head">
          <div class="m-headtext">
            <div class="m-title">${a("mock.home")}</div>
            <div class="m-sub">${a("mock.sub")}</div>
          </div>
          <div class="m-avatar">C</div>
        </div>
        <div class="m-chips">
          <span class="m-chip on">${a("mock.living_room")}</span>
          <span class="m-chip">${a("mock.kitchen")}</span>
          <span class="m-chip">${a("mock.bedroom")}</span>
          <span class="m-chip">${a("mock.garden")}</span>
        </div>
        <div class="m-grid">
          <div class="m-col">
            <div class="m-tiles">
              <div class="m-card">
                <div class="m-ic on">${p("bulb",19)}</div>
                <div class="m-name">${a("mock.ceiling")}</div>
                <div class="m-state">${a("mock.on_percent")}</div>
              </div>
              <div class="m-card">
                <div class="m-ic">${p("bulb",19)}</div>
                <div class="m-name">${a("mock.floor_lamp")}</div>
                <div class="m-state">${a("mock.off")}</div>
              </div>
            </div>
            <div class="m-bubble">
              <div class="m-fill"></div>
              <div class="m-bic">${p("sun",18)}</div>
              <div class="m-btext">
                <div class="m-name">${a("mock.dining_table")}</div>
                <div class="m-state">60 %</div>
              </div>
            </div>
          </div>
          <div class="m-col">
            <div class="m-card">
              <div class="m-row">
                <div class="m-ic on">${p("thermo",19)}</div>
                <div class="m-state">${a("mock.living_room")}</div>
              </div>
              <div class="m-temp">21.5°</div>
              <div class="m-state">${a("mock.heating_to")}</div>
              <div class="m-track"><div class="m-tfill"></div></div>
            </div>
            <div class="m-card m-media">
              <div class="m-art"></div>
              <div class="m-btext">
                <div class="m-name">${a("mock.playlist")}</div>
                <div class="m-state">${a("mock.speaker")}</div>
              </div>
              <div class="m-play">${mt()}</div>
            </div>
          </div>
          <div class="m-col m-col3">
            <div class="m-pop">
              <div class="m-name">${a("mock.front_door")}</div>
              <div class="m-state">${a("mock.locked")}</div>
              <div class="m-track"><div class="m-tfill"></div></div>
            </div>
            <div class="m-card">
              <div class="m-ic">${p("home",19)}</div>
              <div class="m-name">${a("mock.away")}</div>
              <div class="m-state">${a("mock.off")}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-nav">
        <span class="on">${p("home",21)}</span>
        <span>${p("bulb",21)}</span>
        <span>${p("thermo",21)}</span>
        <span>${p("image",21)}</span>
      </div>
    </div>
  `}var bt=w`
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
  /* "Scrolls with the page": the background moves with the content. Home
     Assistant sizes it to one screen; here that is the preview's own height. */
  .mock.scrolls {
    container-type: size;
    background: var(--primary-background-color);
  }
  .mock.scrolls .m-scroll {
    background: var(--lovelace-background, var(--primary-background-color));
    background-attachment: local;
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
`;var ft=w`
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
  img.logo {
    object-fit: cover;
    display: block;
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
    /* One screen in a background that scrolls with the page: the preview's
       height instead of the browser window's (see .mock.scrolls). */
    --theme-studio-background-height: max(100cqh, 75cqw);
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
`;var er=["contrast","saturation","tone","hue_shift","accent_strength","neutrality"].map(n=>`ctl-${n}`),E={quick:[{id:"q.new",chapter:"quick",screen:"library",targets:["new"],side:"below",clip:"newDialog"},{id:"q.base",chapter:"quick",screen:"editor",section:"colours",targets:["group-base"],side:"right",clip:"swatch"},{id:"q.variant",chapter:"quick",screen:"editor",section:"colours",targets:["variant"],side:"below",clip:"variant"},{id:"q.check",chapter:"quick",screen:"editor",section:"colours",targets:["section-check"],side:"right",clip:"checks"},{id:"q.preview",chapter:"quick",screen:"editor",section:"colours",targets:["preview"],side:"left",clip:"devices"},{id:"q.use",chapter:"quick",screen:"editor",section:"colours",targets:["use"],side:"below",clip:"useDialog"},{id:"q.end",chapter:"quick",screen:"editor",section:"colours",targets:["help"],side:"below",clip:"help"}],full:[{id:"f.cards",chapter:"overview",screen:"library",targets:["card"],limit:2,side:"right",clip:"cards"},{id:"f.filter",chapter:"overview",screen:"library",targets:["filter"],side:"below",clip:"filter"},{id:"f.new",chapter:"overview",screen:"library",targets:["new"],side:"below",clip:"newDialog"},{id:"f.import",chapter:"overview",screen:"library",targets:["import"],fallback:["new"],side:"below",clip:"importDialog"},{id:"f.reload",chapter:"overview",screen:"library",targets:["reload"],side:"below",clip:"reload"},{id:"f.name",chapter:"top",screen:"editor",section:"colours",targets:["name"],side:"below",clip:"status"},{id:"f.undo",chapter:"top",screen:"editor",section:"colours",targets:["undo"],side:"below",clip:"undo"},{id:"f.variant",chapter:"top",screen:"editor",section:"colours",targets:["variant"],side:"below",clip:"variant"},{id:"f.use",chapter:"top",screen:"editor",section:"colours",targets:["use"],side:"below",clip:"useShare"},{id:"f.base",chapter:"colours",screen:"editor",section:"colours",targets:["group-base"],side:"right",clip:"swatch"},{id:"f.adjust",chapter:"colours",screen:"editor",section:"colours",targets:er,side:"right",clip:"sliders"},{id:"f.style",chapter:"colours",screen:"editor",section:"colours",targets:["ctl-preview_mode","ctl-color_model"],side:"right",clip:"model"},{id:"f.roles",chapter:"colours",screen:"editor",section:"colours",targets:["group-roles"],side:"right",clip:"roles"},{id:"f.more",chapter:"colours",screen:"editor",section:"colours",targets:["group-more","group-finetune"],side:"right",clip:"collapsed"},{id:"f.mirror",chapter:"colours",screen:"editor",section:"colours",targets:["group-mirror"],side:"right",clip:"mirror"},{id:"f.link",chapter:"surfaces",screen:"editor",section:"surfaces",targets:["link"],side:"right",clip:"link"},{id:"f.shape",chapter:"surfaces",screen:"editor",section:"surfaces",targets:["group-shape","group-glass"],side:"right",clip:"shape"},{id:"f.border",chapter:"surfaces",screen:"editor",section:"surfaces",targets:["group-border"],side:"right",clip:"border"},{id:"f.shadow",chapter:"surfaces",screen:"editor",section:"surfaces",targets:["group-shadow"],side:"right",clip:"shadow"},{id:"f.bubble",chapter:"surfaces",screen:"editor",section:"surfaces",targets:["group-bubble"],side:"right",clip:"bubble"},{id:"f.image",chapter:"background",screen:"editor",section:"background",targets:["ctl-background_contrast","images"],side:"right",clip:"images"},{id:"f.overlay",chapter:"background",screen:"editor",section:"background",targets:["group-overlay"],side:"right",clip:"overlay"},{id:"f.header",chapter:"background",screen:"editor",section:"background",targets:["group-header"],side:"right",clip:"header"},{id:"f.scroll",chapter:"background",screen:"editor",section:"background",targets:["ctl-background_attachment"],side:"right",clip:"scroll"},{id:"f.fonts",chapter:"type",screen:"editor",section:"type",targets:["group-font"],side:"right",clip:"fonts"},{id:"f.ownfont",chapter:"type",screen:"editor",section:"type",targets:["group-custom-font"],side:"right",clip:"ownFont"},{id:"f.check",chapter:"check",screen:"editor",section:"check",targets:["check-list"],side:"right",clip:"checks"},{id:"f.preview",chapter:"preview",screen:"editor",section:"colours",targets:["preview"],side:"left",clip:"devices"},{id:"f.delete",chapter:"finish",screen:"editor",section:"colours",targets:[],side:"center",clip:"delete"},{id:"f.end",chapter:"finish",screen:"editor",section:"colours",targets:["help"],side:"below",clip:"help"}]};function _t(n,r){return[...n.querySelectorAll(`[data-tour="${r}"]`)].filter(e=>{let t=e.getBoundingClientRect();return t.width>0&&t.height>0})}function kt(n,r){return r.fallback&&!r.targets.some(e=>_t(n,e).length)?r.fallback:r.targets}function Ae(n,r,e){let t=[];for(let u of kt(n,e)){let h=[...n.querySelectorAll(`[data-tour="${u}"]`)].filter(g=>{let m=g.getBoundingClientRect();return m.width>0&&m.height>0});for(let g of h.slice(0,e.limit??h.length))t.push(g.getBoundingClientRect())}if(!t.length)return;let i=Math.max(r.left,Math.min(...t.map(u=>u.left))),o=Math.max(r.top,Math.min(...t.map(u=>u.top))),s=Math.min(r.right,Math.max(...t.map(u=>u.right))),d=Math.min(r.bottom,Math.max(...t.map(u=>u.bottom)));if(!(s<=i||d<=o))return{x:i-r.left-6,y:o-r.top-6,w:s-i+12,h:d-o+12}}function Ce(n,r){let e=_t(n,kt(n,r)[0])[0];return e?(e.scrollIntoView({block:e.closest("header")?"nearest":"start",inline:"nearest"}),!0):!1}var Se=420;function yt(n,r,e,t){if(e<720)return{style:{left:"8px",right:"8px",maxHeight:"62%",...(n?n.y+n.h/2:t)>t/2?{top:"8px"}:{bottom:"8px"}},arrow:void 0,sheet:!0};let i=e<1180?380:400,o=e-16-i,s=Math.max(16,t-16-Se),d=(v,F,oe)=>Math.max(F,Math.min(oe,v));if(!n||r==="center")return{style:{left:`${Math.round((e-i)/2)}px`,top:`${Math.round(Math.max(16,(t-Se)/2))}px`,width:`${i}px`},arrow:void 0,sheet:!1};let u=n.x+n.w/2,h=n.y+Math.min(n.h,140)/2,g=r;if(r==="right"&&n.x+n.w+14>o&&(g=n.x-14-i>=16?"left":"below"),r==="left"&&n.x-14-i<16&&(g=n.x+n.w+14<=o?"right":"below"),g==="below"&&n.y+n.h+12>s){let v=n.x,F=e-n.x-n.w,oe=`${d(h-70,16,s)}px`;return Math.max(v,F)>=200?{style:{left:`${v>=F?16:o}px`,top:oe,width:`${i}px`},arrow:void 0,sheet:!1}:{style:{left:`${d(u-i/2,16,o)}px`,top:`${s}px`,width:`${i}px`},arrow:void 0,sheet:!1}}if(g==="below"){let v=d(u-i/2,16,o);return{style:{left:`${v}px`,top:`${n.y+n.h+12}px`,width:`${i}px`},arrow:{left:`${d(u-v-7,18,i-32)}px`,top:"-7px"},sheet:!1}}let m=d(h-70,16,s),_=`${d(h-m-7,18,Se-60)}px`;return g==="left"?{style:{left:`${n.x-14-i}px`,top:`${m}px`,width:`${i}px`},arrow:{left:`${i-7}px`,top:_},sheet:!1}:{style:{left:`${n.x+n.w+14}px`,top:`${m}px`,width:`${i}px`},arrow:{left:"-7px",top:_},sheet:!1}}function B(n,r,e,t){return l`<div class="c-field">
    ${t?l`<div class="c-lbl">${t}</div>`:c}
    <div class="c-seg">
      ${n.map((i,o)=>l`<span class=${r?o===0?"a":o===1?"b":"":o===0?"on":""}
          >${e?p(e[o],16):c}${i}</span
        >`)}
    </div>
  </div>`}function R(n,r,e,t=!1){return l`<div class="c-slider">
    <div class="c-srow"><span>${n}</span><span class="c-val">${r}</span></div>
    <div class="c-track">
      <div class="c-fill ${t?"anim":""}" style="width: ${e}%"></div>
      <div class="c-knob ${t?"anim":""}" style="left: calc(${e}% - 9px)"></div>
    </div>
  </div>`}function A(n){return l`<div class="c-row">
    ${n.map(r=>l`<span class="c-btn ${r.kind??""} ${r.label?"":"icon"}">
        ${r.icon?p(r.icon,18):c}${r.label??c}
      </span>`)}
  </div>`}function G(n,r){return l`<div class="c-switch-row"><span>${n}</span><span class="c-switch ${r}"><span></span></span></div>`}function $e(n,r,e,t,i){return l`<div class="c-tiles">
    ${r.map((o,s)=>l`<div class="c-tile ${s===e?"sel":""} ${s===t?"tap":""}">
        <div class="c-art" style=${i[s]}></div>
        <span>${a(`${n}.${o}`)}</span>
      </div>`)}
  </div>`}function Te(n,r,e,t){return l`<div class="c-dialog">
    <div class="c-dtitle">${n}</div>
    ${r.map((i,o)=>l`<div class="c-opt ${o===e?"tap":""}">
        ${p(i.icon,20)}
        <div><div class="c-ot">${i.title}</div><div class="c-oh">${i.hint}</div></div>
      </div>`)}
    ${t??c}
  </div>`}function vt(n,r,e){let t=i=>i?l`<div class="c-half" style=${b({background:i.page})}>
          <i style=${b({background:i.text,width:"55%",height:"5px"})}></i>
          <i style=${b({background:i.card})}></i>
          <i style=${b({background:i.card})}></i>
        </div>`:l`<div class="c-half"></div>`;return l`<div class="c-card">
    <div class="c-mini">${t(n.light)}${t(n.dark)}</div>
    <strong>${n.name}</strong>
    <span class="c-badge ${e?"warn":""}">${r}</span>
  </div>`}var tr=["background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.22)","background:linear-gradient(#fafbfc,#eef0f3);box-shadow:inset 0 1px 0 rgba(255,255,255,.9),inset 0 -1px 0 rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.12)","background:#fff;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2),inset 0 0 0 3px #fff,inset 0 0 0 4px rgba(0,0,0,.14)"],rr=["background:#fff;box-shadow:0 6px 14px rgba(0,0,0,.2)","background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 0 16px rgba(120,150,255,.5)","background:#fff;box-shadow:5px 7px 0 rgba(0,0,0,.18)"],ar=["background:radial-gradient(80% 60% at 30% 30%,rgba(120,200,255,.6),transparent),radial-gradient(70% 60% at 75% 70%,rgba(200,120,255,.5),transparent),#dfe3e8","background:repeating-radial-gradient(circle at 50% 40%,rgba(0,0,0,.09) 0 3px,transparent 3px 9px),#e6e9ec","background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.95),rgba(255,255,255,0) 55%),#c9d0d7"],ir=["background:linear-gradient(160deg,#8e98a1,#e6e9ec 58%,#c3c9cf)","background:linear-gradient(200deg,#f4f6f8,#d5dbe1 50%,#a7b0b9)","background:linear-gradient(135deg,#ff9a3c,#ffcf8a 55%,#fff2dc)"];function wt(n,r){let e=a("variant.light"),t=a("variant.dark"),i=r.variant==="light"?e:t,o=r.variant==="light"?t:e;switch(n.clip){case"newDialog":return Te(a("new.title"),[{icon:"grid",title:a("new.preset"),hint:a("new.preset_hint")},{icon:"palette",title:a("new.colour"),hint:a("new.colour_hint")},{icon:"image",title:a("new.image"),hint:a("new.image_hint")}],1);case"importDialog":return Te(a("import.title"),[],-1,l`<div class="c-lbl">${a("import.field")}</div>
          <div class="c-input">TS1:eJyrVkrOT0lVslJKz8nPS1WqBQ…</div>
          <div class="c-row">${A([{label:a("import.file"),icon:"upload",kind:"sm tap"}])}</div>`);case"useDialog":case"useShare":return Te(a("use.title",{name:r.cards[0]?.name??"Glass"}),[{icon:"phone",title:a("use.me"),hint:a("use.me_hint")},{icon:"home",title:a("use.everyone"),hint:a("use.everyone_hint")}],1,n.clip==="useShare"?l`<div class="c-lbl">${a("use.share")}</div>
              ${A([{label:a("use.copy"),icon:"copy",kind:"sm"},{label:a("use.download"),icon:"download",kind:"sm"}])}`:void 0);case"cards":return l`<div class="c-cards">
        ${r.cards[0]?vt(r.cards[0],a("lib.in_use_everyone"),!1):c}
        ${r.cards[1]?vt(r.cards[1],a("lib.to_check",{count:2}),!0):c}
      </div>`;case"filter":return B([a("lib.all"),a("lib.mine"),a("lib.builtin")],!0);case"reload":return A([{icon:"refresh",kind:"tap"},{label:a("lib.reload")}]);case"status":return l`<div class="c-status">
        <span class="c-name">${r.cards[0]?.name??"Glass"}<i class="c-caret"></i></span>
        <span class="c-saved">${p("check",16)}${a("status.saved")}</span>
      </div>`;case"undo":return A([{icon:"undo",kind:"tap"},{icon:"redo"},{label:`${a("editor.undo")} \xB7 ${a("editor.redo")}`}]);case"variant":return B([e,t],!0,["sun","moon"]);case"swatch":return l`<div class="c-swatch">
        <span style=${b({background:r.base})}></span>
        <div><div class="c-mono">${r.base}</div><div class="c-hint">${a("base.pick")}</div></div>
      </div>`;case"sliders":return l`${R(a("ctl.contrast"),"58",58,!0)}${R(a("ctl.saturation"),"+11",61)}`;case"model":return l`${B([a("opt.hsl"),a("opt.oklch")],!0,void 0,a("ctl.color_model"))}
      ${B([a("opt.Relaxed"),a("opt.Focused"),a("opt.Vibrant")],!1,void 0,a("ctl.preview_mode"))}`;case"roles":return l`${[["role.page","#dbdfe1",!1],["role.card","#e7eaeb",!1],["role.accent","#a85a00",!0]].map(([s,d,u])=>l`<div class="c-role">
          <span class="c-rsw" style=${b({background:String(d)})}></span>
          <span class="c-rlabel">${a(String(s))}</span>
          <span class="c-mini-seg"
            ><span class=${u?"a":"on"}>${a("role.auto")}</span><span class=${u?"b":""}>${a("role.manual")}</span></span
          >
        </div>`)}`;case"collapsed":return l`<div class="c-collapsed">${a("group.more")}${p("chevron",18)}</div>
        <div class="c-collapsed">${a("group.finetune")}${p("chevron",18)}</div>`;case"mirror":return A([{label:a("mirror.button",{target:o,source:i}),icon:"swap",kind:"tap"}]);case"link":return l`${G(a("link.title"),"anim")}<p class="c-hint">${a("link.on")}</p>`;case"shape":return l`${R(a("ctl.radius"),"28 px",56,!0)}${R(a("ctl.blur_strength"),"17 px",34)}`;case"border":return $e("border",["soft_hairline","glass_edge","etched"],0,1,tr);case"shadow":return $e("shadow",["soft_depth","glass_glow","drop_shadow"],1,2,rr);case"bubble":return l`${G(a("ctl.bubble_use_fx"),"anim")}${G(a("ctl.popup_use_fx"),"on")}`;case"images":return l`<div class="c-tiles">
          ${ir.map((s,d)=>l`<div class="c-img ${d===0?"sel":""}" style=${s}></div>`)}
          <div class="c-upload">${p("upload",18)}<span>${a("images.upload")}</span></div>
        </div>
        ${R(a("ctl.background_contrast"),"35",35,!0)}`;case"overlay":return $e("overlay",["aurora","topographic","halo"],1,2,ar);case"header":return l`${G(a("ctl.enable_header_blend"),"anim")}${R(a("ctl.header_blend_height"),"170 px",37,!0)}`;case"scroll":return B([a("opt.fixed"),a("opt.scroll")],!0,void 0,a("ctl.background_attachment"));case"fonts":return l`<div class="c-fonts">
        ${[["system-ui",a("font.system-ui")],["Quicksand","Quicksand"],["Josefin Sans","Josefin Sans"],["Orbitron","Orbitron"]].map(([s,d],u)=>l`<div class="c-font ${u===1?"sel":""}">
            <b style=${b({fontFamily:`"${s}", system-ui, sans-serif`})}>Aa</b><span>${d}</span>
          </div>`)}
      </div>`;case"ownFont":return l`${G(a("ctl.use_custom_font"),"anim")}
        <div class="c-lbl">${a("ctl.custom_font_family")}</div>
        <div class="c-input">My Font</div>`;case"checks":return l`<div class="c-check">
          <div><div class="c-rn">${a("pair.text_card")}</div><div class="c-hint">${a("check.ratio",{ratio:"12.1",minimum:4.5})}</div></div>
          <span class="c-badge">${a("check.readable")}</span>
        </div>
        <div class="c-check">
          <div><div class="c-rn">${a("pair.active_icon_card")}</div><div class="c-hint">${a("check.ratio",{ratio:"2.6",minimum:3})}</div></div>
          <span class="c-btn sm tap">${p("wand",16)}${a("check.use_auto")}</span>
        </div>`;case"devices":return l`${B([a("device.phone"),a("device.tablet"),a("device.desktop")],!0,["phone","tablet","desktop"])}
      ${A([{label:a("preview.both"),icon:"split"}])}`;case"delete":return A([{label:a("editor.delete"),icon:"trash",kind:"danger tap"}]);case"help":return A([{icon:"help",kind:"help tap"},{label:a("tour.help")}])}}var xt=w`
  :host {
    position: relative;
  }
  [data-tour] {
    scroll-margin: 14px;
  }
  .tour-layer,
  .tour-hint-layer {
    position: fixed;
    z-index: 20;
    overflow: hidden;
  }
  .tour-hint-layer {
    z-index: 21;
    pointer-events: none;
  }
  .tour-hint-layer .tour-hint {
    pointer-events: auto;
  }
  .tour-spot {
    position: absolute;
    border-radius: 16px;
    box-shadow:
      0 0 0 9999px rgba(10, 12, 16, 0.55),
      0 0 0 3px #ffffff,
      0 0 0 7px rgba(134, 164, 255, 0.75);
    pointer-events: none;
    transition: all 0.25s ease;
  }
  .tour-dim {
    position: absolute;
    inset: 0;
    background: rgba(10, 12, 16, 0.55);
  }
  .tour-pop {
    position: absolute;
    box-sizing: border-box;
    max-height: calc(100% - 16px);
    display: flex;
    flex-direction: column;
    background: var(--ts-panel);
    color: var(--ts-ink);
    border-radius: 18px;
    box-shadow:
      0 18px 50px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(0, 0, 0, 0.06);
  }
  .tour-inner {
    min-height: 0;
    overflow: auto;
    padding: 16px 18px;
    overscroll-behavior: contain;
  }
  .tour-pop:focus {
    outline: none;
  }
  .tour-arrow {
    position: absolute;
    width: 14px;
    height: 14px;
    background: var(--ts-panel);
    transform: rotate(45deg);
    border-radius: 3px;
  }
  .tour-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }
  .tour-count {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ts-sel);
  }
  .tour-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 6px;
  }
  .tour-body {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
  .tour-progress {
    height: 4px;
    border-radius: 2px;
    background: var(--ts-line);
    margin: 14px 0 12px;
    overflow: hidden;
  }
  .tour-progress span {
    display: block;
    height: 4px;
    background: var(--ts-sel);
  }
  .tour-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .tour-foot .grow {
    flex: 1;
  }
  .linkish {
    border: 0;
    background: transparent;
    padding: 8px 6px;
    font-weight: 600;
    font-size: 13px;
    color: var(--ts-muted);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .tour-choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 4px 0 6px;
  }
  .tour-choice {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    border-radius: 16px;
    padding: 13px 14px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tour-choice.main {
    border-color: var(--ts-ink);
    box-shadow: 0 0 0 1px var(--ts-ink);
  }
  .tour-choice strong {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
  }
  .tour-meta {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ts-sel);
  }
  .tour-langs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tour-lang {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    border-radius: 999px;
    height: 36px;
    padding: 0 13px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }
  .tour-lang.on {
    background: var(--ts-ink);
    color: var(--ts-panel);
    border-color: var(--ts-ink);
  }
  .tour-ring {
    position: absolute;
    border-radius: 14px;
    box-shadow:
      0 0 0 3px var(--ts-panel),
      0 0 0 7px rgba(42, 85, 216, 0.55);
    pointer-events: none;
    z-index: 21;
  }
  .tour-hint {
    position: absolute;
    z-index: 21;
    width: 280px;
    max-width: calc(100% - 16px);
    box-sizing: border-box;
  }
  .tour-choices.narrow {
    grid-template-columns: minmax(0, 1fr);
  }
  .tour-welcome .tour-note {
    margin: 0;
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .tour-welcome .tour-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .tour-welcome .dfoot {
    justify-content: space-between;
    align-items: center;
  }
  .btn.help {
    color: var(--ts-sel);
  }
  .only-p {
    display: none;
  }
  .opts.one {
    grid-template-columns: minmax(0, 1fr);
  }
  .lib-tools {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tour-welcome:focus {
    outline: none;
  }
  .chips .btn.help {
    min-height: 40px;
    width: 40px;
    border-radius: 999px;
  }
  @container (max-width: 719px) {
    .only-p {
      display: inline-flex;
    }
  }

  /* Clips: small live drawings of the control a step explains. */
  .clip {
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    border-radius: 14px;
    padding: 12px 14px;
    margin: 2px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
    font-size: 13px;
  }
  .c-lbl {
    font-size: 13px;
    font-weight: 600;
  }
  .c-hint {
    font-size: 12px;
    color: var(--ts-muted);
    margin: 0;
  }
  .c-mono {
    font-family: var(--ts-mono);
    font-weight: 600;
    font-size: 15px;
  }
  .c-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .c-seg,
  .c-mini-seg {
    display: flex;
    padding: 3px;
    border-radius: 12px;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    gap: 2px;
  }
  .c-seg span {
    flex: 1;
    min-width: 0;
    height: 32px;
    padding: 0 8px;
    border-radius: 9px;
    font-weight: 600;
    font-size: 12.5px;
    color: var(--ts-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
  }
  .c-seg .on,
  .c-mini-seg .on {
    background: var(--ts-ink);
    color: var(--ts-panel);
  }
  .c-seg .a,
  .c-mini-seg .a {
    animation: c-a 3s steps(1) infinite;
  }
  .c-seg .b,
  .c-mini-seg .b {
    animation: c-b 3s steps(1) infinite;
  }
  @keyframes c-a {
    0% {
      background: var(--ts-ink);
      color: var(--ts-panel);
    }
    50% {
      background: transparent;
      color: var(--ts-muted);
    }
  }
  @keyframes c-b {
    0% {
      background: transparent;
      color: var(--ts-muted);
    }
    50% {
      background: var(--ts-ink);
      color: var(--ts-panel);
    }
  }
  .c-mini-seg {
    display: inline-flex;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 600;
  }
  .c-mini-seg span {
    padding: 4px 9px;
    border-radius: 7px;
    color: var(--ts-muted);
  }
  .c-slider {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 4px 0;
  }
  .c-srow {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
  }
  .c-val {
    font-family: var(--ts-mono);
    color: var(--ts-muted);
    font-size: 12.5px;
  }
  .c-track {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: var(--ts-line);
  }
  .c-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 6px;
    border-radius: 3px;
    background: var(--ts-sel);
  }
  .c-knob {
    position: absolute;
    top: -6px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--ts-panel);
    border: 2px solid var(--ts-sel);
    box-sizing: border-box;
  }
  .c-fill.anim {
    animation: c-fill 2.6s ease-in-out infinite;
  }
  .c-knob.anim {
    animation: c-knob 2.6s ease-in-out infinite;
  }
  @keyframes c-fill {
    0%,
    100% {
      width: 30%;
    }
    50% {
      width: 72%;
    }
  }
  @keyframes c-knob {
    0%,
    100% {
      left: calc(30% - 9px);
    }
    50% {
      left: calc(72% - 9px);
    }
  }
  .c-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .c-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    font-weight: 600;
    white-space: nowrap;
  }
  .c-btn.icon {
    width: 40px;
    padding: 0;
  }
  .c-btn.sm {
    height: 32px;
    padding: 0 10px;
    font-size: 12.5px;
    border-radius: 9px;
  }
  .c-btn.danger {
    color: var(--ts-warn);
  }
  .c-btn.help {
    color: var(--ts-sel);
    background: var(--ts-sel-soft);
  }
  .tap::after {
    content: "";
    position: absolute;
    right: 6px;
    bottom: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(42, 85, 216, 0.55);
    animation: c-tap 1.8s ease-out infinite;
  }
  @keyframes c-tap {
    0% {
      transform: scale(0.4);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: scale(1.9);
      opacity: 0;
    }
  }
  .c-switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-weight: 600;
    min-height: 40px;
  }
  .c-switch {
    position: relative;
    width: 40px;
    height: 24px;
    border-radius: 12px;
    background: var(--ts-line);
    flex: none;
  }
  .c-switch span {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .c-switch.on {
    background: var(--ts-sel);
  }
  .c-switch.on span {
    left: 19px;
  }
  .c-switch.anim {
    animation: c-sw 3s steps(1) infinite;
  }
  .c-switch.anim span {
    animation: c-swk 3s ease-in-out infinite;
  }
  @keyframes c-sw {
    0% {
      background: var(--ts-line);
    }
    50% {
      background: var(--ts-sel);
    }
  }
  @keyframes c-swk {
    0%,
    40% {
      left: 3px;
    }
    50%,
    90% {
      left: 19px;
    }
    100% {
      left: 3px;
    }
  }
  .c-tiles {
    display: flex;
    gap: 8px;
    height: 86px;
  }
  .c-tile {
    position: relative;
    flex: 1;
    min-width: 0;
    border: 1px solid var(--ts-line);
    border-radius: 12px;
    padding: 6px;
    background: var(--ts-panel);
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
  }
  .c-tile span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .c-tile.sel,
  .c-img.sel,
  .c-font.sel {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
  }
  .c-art {
    flex: 1;
    border-radius: 8px;
  }
  .c-img {
    flex: 1;
    border-radius: 10px;
    border: 1px solid var(--ts-line);
  }
  .c-upload {
    flex: 1;
    min-width: 0;
    border: 1px dashed var(--ts-muted);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    color: var(--ts-muted);
  }
  .c-fonts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
  .c-font {
    border: 1px solid var(--ts-line);
    border-radius: 12px;
    background: var(--ts-panel);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 2px;
    font-size: 11px;
    font-weight: 600;
    min-width: 0;
  }
  .c-font b {
    font-size: 24px;
  }
  .c-font span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .c-input {
    border: 1px solid var(--ts-line);
    border-radius: 10px;
    background: var(--ts-panel);
    padding: 8px 10px;
    font-family: var(--ts-mono);
    font-size: 12.5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .c-dialog {
    background: var(--ts-panel);
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .c-dtitle {
    font-weight: 700;
    font-size: 14px;
  }
  .c-opt {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--ts-line);
    border-radius: 11px;
    padding: 7px 10px;
  }
  .c-ot {
    font-weight: 700;
    font-size: 12.5px;
  }
  .c-oh {
    font-size: 11.5px;
    color: var(--ts-muted);
  }
  .c-cards {
    display: flex;
    gap: 10px;
  }
  .c-card {
    flex: 1;
    min-width: 0;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    border-radius: 14px;
    padding: 7px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .c-mini {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 62px;
    border-radius: 9px;
    overflow: hidden;
  }
  .c-half {
    padding: 7px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: var(--ts-panel2);
  }
  .c-half i {
    display: block;
    height: 15px;
    border-radius: 5px;
  }
  .c-badge {
    width: max-content;
    font-family: var(--ts-mono);
    font-size: 11px;
    padding: 3px 7px;
    border-radius: 8px;
    background: var(--ts-ok-soft);
    color: var(--ts-ok);
  }
  .c-badge.warn {
    background: var(--ts-warn-soft);
    color: var(--ts-warn);
  }
  .c-status {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .c-name {
    display: inline-flex;
    align-items: center;
    width: max-content;
    font-size: 18px;
    font-weight: 700;
    border: 1px solid var(--ts-line);
    border-radius: 8px;
    padding: 2px 8px;
    background: var(--ts-panel);
  }
  .c-caret {
    display: inline-block;
    width: 2px;
    height: 20px;
    margin-left: 2px;
    background: var(--ts-sel);
    animation: c-blink 1.1s steps(1) infinite;
  }
  @keyframes c-blink {
    50% {
      opacity: 0;
    }
  }
  .c-saved {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ts-ok);
    font-weight: 600;
    font-size: 12.5px;
  }
  .c-swatch {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .c-swatch > span {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  }
  .c-role {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
  }
  .c-rsw {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
    flex: none;
  }
  .c-rlabel {
    flex: 1;
    font-weight: 600;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .c-collapsed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--ts-line);
    border-radius: 11px;
    padding: 9px 12px;
    background: var(--ts-panel);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ts-muted);
  }
  .c-check {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 44px;
    border-top: 1px solid var(--ts-line);
  }
  .c-check:first-child {
    border-top: 0;
  }
  .c-rn {
    font-weight: 600;
  }
  @media (prefers-reduced-motion: reduce) {
    .clip *,
    .clip *::after,
    .tour-spot {
      animation: none !important;
      transition: none !important;
    }
  }
`;var or=/^\/theme\/([^/]+)/,nr=/^[a-z0-9-]+$/,sr=/[;{}<>]/,lr=/^#?([0-9a-f]{6})$/i,ae=["light","dark"],dr=900,ur=90,cr=800,pr=60,hr=250,St="theme-studio-linked",mr="/api/theme_studio/background",gr="/theme_studio_static/logo-mark.png",$t="theme_studio",Tt={id:"help",chapter:"finish",screen:"library",targets:["help"],limit:1,side:"below",clip:"help"},br={not_an_image:"upload.not_an_image",unsupported_format:"upload.unsupported_format",too_large:"upload.too_large"};function Me(n,r){return n===r||!!(n&&r&&n.x===r.x&&n.y===r.y&&n.w===r.w&&n.h===r.h)}function k(n){if(n&&typeof n=="object"){let r=n;if(r.code==="name_taken")return a("error.name_taken");if(r.code==="unauthorized")return a("error.unauthorized");if("message"in r)return String(r.message)}return String(n)}function De(n){let r={};for(let[e,t]of Object.entries(n))nr.test(e)&&!sr.test(t)&&(r[`--${e}`]=t);return r}function fr(n){if(!n.image||!n.image.startsWith("/"))return n.page;let r=encodeURI(n.image).replace(/'/g,"%27");return`linear-gradient(${n.page}cc, ${n.page}cc), url('${r}') center / cover`}function At(n){let r=n.filter(e=>!e.ok).length;return r===0?a("check.all_readable",{count:n.length}):a("check.some_low",{failing:r,count:n.length})}function vr(n){let r=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i.exec(n),e;if(r)e=[r[1],r[2],r[3]].map(Number);else{let t=/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i.exec(n);t&&(e=[t[1],t[2],t[3]].map(i=>Number(i)*255))}return e?`#${e.map(t=>Math.round(Math.min(255,Math.max(0,t))).toString(16).padStart(2,"0")).join("")}`.toUpperCase():""}function Ee(n){return f(`role.${n.id}`,n.label)}function Ct(n){return f(`pair.${n.key}`,n.label)}function z(n){let r=lr.exec(n.trim());return r?`#${r[1].toUpperCase()}`:void 0}function ie(n){return{light:{...n.light},dark:{...n.dark}}}var W=class extends T{constructor(){super();this._schema=new Map;this._schemaLoading=!1;this._dirty=new Set;this._nameDirty=!1;this._saving=!1;this._saveAgain=!1;this._previewTimers={};this._previewSeq={light:0,dark:0};this._lastTime=0;this._libraryStale=!1;this._wantedTiles=new Map;this._tileSeq=0;this._userDataLoading=!1;this._hintRevealed=!1;this._dismissHint=()=>{this._hint=!1,this._hintRect=void 0};this._tourKey=e=>{if(!this._tour)return;if(e.key==="Escape"){e.preventDefault(),this._endTour();return}let t=e.composedPath()[0];t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement||(e.key==="ArrowRight"?(e.preventDefault(),this._tourNext()):e.key==="ArrowLeft"&&(e.preventDefault(),this._tourBack()))};this._tourMoved=()=>{(this._tour&&this._tour.kind!=="welcome"||this._hint)&&this._tourFrame===void 0&&(this._tourFrame=window.requestAnimationFrame(this._measureTour))};this._measureTour=()=>{this._tourFrame=void 0;let e=this._tour;if(e&&e.kind!=="welcome"){let o=E[e.kind][e.step],s=`${e.kind}:${e.step}`;o.targets.length&&this._revealed!==s&&Ce(this.renderRoot,o)&&(this._revealed=s)}this._hint&&!this._hintRevealed&&Ce(this.renderRoot,Tt)&&(this._hintRevealed=!0);let t=this._visibleBox();Me(t,this._tourBox)||(this._tourBox=t);let i=new DOMRect(t.x,t.y,t.w,t.h);if(e&&e.kind!=="welcome"){let o=E[e.kind][e.step],s=o.targets.length?Ae(this.renderRoot,i,o):void 0;Me(s,this._tourRect)||(this._tourRect=s)}if(this._hint){let o=Ae(this.renderRoot,i,Tt);Me(o,this._hintRect)||(this._hintRect=o)}};this._closeDialog=()=>{this._busy||(this._dialog=void 0)};this.narrow=!1,this._loading=!1,this._filter="all",this._variant="light",this._both=!1,this._device="phone",this._previews={},this._probe={},this._section="colours",this._open=new Set,this._saveState="saved",this._history=[],this._future=[],this._busy=!1,this._newMode="preset",this._newSource="default",this._newColour="#3A6EA5",this._newName="",this._tiles={},this._useScope="device",this._importText="",this._inUse={everyone:[]},this._linked=new Set,this._size={width:0,height:0},this._hint=!1;try{let e=JSON.parse(window.localStorage.getItem(St)??"[]");Array.isArray(e)&&(this._linked=new Set(e.map(String)))}catch{}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._tourKey),window.addEventListener("scroll",this._tourMoved,{capture:!0,passive:!0}),window.addEventListener("resize",this._tourMoved,{passive:!0}),this.renderRoot.addEventListener("scroll",this._tourMoved,{capture:!0,passive:!0}),typeof ResizeObserver<"u"&&(this._resizer=new ResizeObserver(()=>{this._size={width:this.clientWidth,height:this.clientHeight}}),this._resizer.observe(this))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._tourKey),window.removeEventListener("scroll",this._tourMoved,{capture:!0}),window.removeEventListener("resize",this._tourMoved),this.renderRoot.removeEventListener("scroll",this._tourMoved,{capture:!0}),this._resizer?.disconnect(),this._resizer=void 0,this._tourFrame!==void 0&&(window.cancelAnimationFrame(this._tourFrame),this._tourFrame=void 0),this._flush()}get _slug(){let e=or.exec(this.route?.path??"");return e?decodeURIComponent(e[1]):void 0}get _narrow(){return this._size.width>0&&this._size.width<720}get _canEdit(){return this.hass?.user?.is_admin!==!1}willUpdate(e){e.has("hass")&&this.hass&&(this.toggleAttribute("dark",!!this.hass.themes?.darkMode),!this._themes&&!this._loading&&!this._error&&this._loadThemes(),!this._schema.size&&!this._schemaLoading&&this._loadSchema(),!this._userData&&!this._userDataLoading&&this._loadUserData());let t=this._slug;this.hass&&t&&t!==this._detailSlug&&this._loadDetail(t),e.has("_section")&&this._section==="background"&&this._loadBackgrounds(),!t&&this._libraryStale&&e.has("route")&&(this._libraryStale=!1,this._loadThemes())}updated(e){e.has("_previews")&&this._resolveProbe(),this._wantedTiles.size&&(window.clearTimeout(this._tileTimer),this._tileTimer=window.setTimeout(()=>void this._loadTiles(),hr)),e.has("_tour")&&this._tour&&this.renderRoot.querySelector(".tour-pop, .tour-welcome")?.focus({preventScroll:!0}),(this._tour&&this._tour.kind!=="welcome"||this._hint)&&this._tourFrame===void 0&&(this._tourFrame=window.requestAnimationFrame(this._measureTour))}async _loadThemes(){if(this.hass){this._loading=!0,this._error=void 0;try{let e=await this.hass.callWS({type:"theme_studio/themes"});this._themes=e.themes,this._loadInUse()}catch(e){this._error=k(e)}finally{this._loading=!1}}}async _loadInUse(){if(this.hass)try{let e=await this.hass.callWS({type:"frontend/get_themes"}),t=[e.default_theme,e.default_dark_theme].filter(i=>!!i&&i!=="default");this._inUse={everyone:t,device:this.hass.selectedTheme?.theme}}catch{this._inUse={everyone:[],device:this.hass.selectedTheme?.theme}}}_inUseText(e){if(this._inUse.everyone.includes(e))return a("lib.in_use_everyone");if(this._inUse.device===e)return a("lib.in_use_you")}async _loadSchema(){if(this.hass){this._schemaLoading=!0;try{let e=await this.hass.callWS({type:"theme_studio/schema"});this._schema=new Map(e.settings.map(t=>[t.key,t])),this.requestUpdate()}catch(e){this._error=k(e)}finally{this._schemaLoading=!1}}}async _loadDetail(e){if(this.hass){await this._flush(),this._detailSlug=e,this._edit=void 0,this._previews={},this._probe={},this._detailError=void 0,this._history=[],this._future=[],this._hexDraft=void 0,this._saveState="saved",this._saveError=void 0;try{let t=await this.hass.callWS({type:"theme_studio/theme",slug:e});if(this._detailSlug!==e)return;if(!t.light||!t.dark){this._detailError=a("editor.not_built");return}this._edit={slug:t.slug,name:t.name,builtin:t.builtin,settings:{light:{...t.light.settings},dark:{...t.dark.settings}}},this._previews={light:t.light,dark:t.dark}}catch(t){this._detailSlug===e&&(this._detailError=k(t))}}}async _loadBackgrounds(){if(!(!this.hass||this._backgrounds))try{let e=await this.hass.callWS({type:"theme_studio/backgrounds"});this._backgrounds=e.images,this._newImage=this._newImage??e.images[0]?.file}catch{this._backgrounds=[]}}_navigate(e,t=!1){t?window.history.replaceState(null,"",e):window.history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:t}}))}_prefix(){return this.route?.prefix??"/theme-studio-panel"}_openTheme(e){this._navigate(`${this._prefix()}/theme/${encodeURIComponent(e)}`)}async _back(){await this._flush(),this._detailSlug=void 0,this._edit=void 0,this._navigate(this._prefix())}_refresh(){this._themes=void 0,this._error=void 0,this._loadThemes()}_showToast(e){this._toast=e,window.clearTimeout(this._toastTimer),this._toastTimer=window.setTimeout(()=>{this._toast=void 0},3600)}_snapshot(){return this._edit?{name:this._edit.name,settings:ie(this._edit.settings)}:void 0}_pushHistory(e){let t=Date.now(),i=e!==void 0&&e===this._lastKey&&t-this._lastTime<cr;if(this._lastKey=e,this._lastTime=t,i)return;let o=this._snapshot();o&&(this._history=[...this._history,o].slice(-pr),this._future=[])}_change(e,t,i){if(!this._edit||!this._canEdit)return;this._pushHistory(i);let o=ie(this._edit.settings);for(let s of e)o[s]={...o[s],...t},this._dirty.add(s),this._schedulePreview(s);this._edit={...this._edit,settings:o},this._scheduleSave()}_replaceVariant(e,t){if(!this._edit||!this._canEdit)return;this._pushHistory();let i=ie(this._edit.settings);i[e]={...i[e],...t},this._dirty.add(e),this._edit={...this._edit,settings:i},this._schedulePreview(e),this._scheduleSave()}_rename(e){!this._edit||!this._canEdit||(this._pushHistory("name"),this._edit={...this._edit,name:e},this._nameDirty=!0,e.trim()&&this._scheduleSave())}_restore(e){let t=this[e],i=this._snapshot();if(!t.length||!this._edit||!i)return;let o=t[t.length-1];e==="_history"?(this._history=t.slice(0,-1),this._future=[...this._future,i]):(this._future=t.slice(0,-1),this._history=[...this._history,i]),this._lastKey=void 0,this._hexDraft=void 0,this._edit={...this._edit,name:o.name,settings:ie(o.settings)},this._nameDirty=this._nameDirty||o.name!==i.name;for(let s of ae)this._dirty.add(s),this._schedulePreview(s);this._scheduleSave()}_schedulePreview(e){window.clearTimeout(this._previewTimers[e]),this._previewTimers[e]=window.setTimeout(()=>void this._runPreview(e),ur)}async _runPreview(e){if(!this.hass||!this._edit)return;let t=++this._previewSeq[e];try{let i=await this.hass.callWS({type:"theme_studio/preview",settings:this._edit.settings[e]});t===this._previewSeq[e]&&(this._previews={...this._previews,[e]:i})}catch(i){this._showToast(a("toast.preview_failed",{error:k(i)}))}}_scheduleSave(e=dr){this._saveState="unsaved",window.clearTimeout(this._saveTimer),this._saveTimer=window.setTimeout(()=>void this._save(),e)}async _flush(){window.clearTimeout(this._saveTimer),(this._dirty.size||this._nameDirty)&&await this._save()}async _save(){if(!this.hass||!this._edit||!this._canEdit)return;if(this._saving){this._saveAgain=!0;return}if(!this._dirty.size&&!this._nameDirty){this._saveState="saved";return}this._saving=!0,this._saveState="saving";let e=new Set(this._dirty),t=this._nameDirty;this._dirty.clear(),this._nameDirty=!1;try{this._edit.builtin&&(await this._fork(),ae.forEach(s=>e.add(s)));let i=this._edit,o={type:"theme_studio/theme/save",slug:i.slug};t&&i.name.trim()&&(o.name=i.name.trim());for(let s of e)o[s]=i.settings[s];await this.hass.callWS(o),this._libraryStale=!0,this._saveError=void 0,this._saveState=this._dirty.size||this._nameDirty?"unsaved":"saved"}catch(i){e.forEach(o=>this._dirty.add(o)),this._nameDirty=this._nameDirty||t,this._saveState="error",this._saveError=k(i)}finally{this._saving=!1,this._saveAgain&&(this._saveAgain=!1,this._scheduleSave(200))}}async _fork(){if(!this.hass||!this._edit)return;let e=this._edit.name!==this._presetName()?this._edit.name:a("editor.copy_name",{name:this._edit.name}),t=await this.hass.callWS({type:"theme_studio/theme/new",source:this._edit.slug,name:e.trim()||a("editor.copy_name",{name:this._presetName()})});this._edit={...this._edit,slug:t.slug,name:t.name,builtin:!1},this._detailSlug=t.slug,this._navigate(`${this._prefix()}/theme/${encodeURIComponent(t.slug)}`,!0),this._showToast(a("toast.forked",{name:t.name}))}_presetName(){return this._themes?.find(t=>t.slug===this._edit?.slug)?.name??this._edit?.name??""}async _use(){if(!this.hass||!this._edit)return;this._busy=!0;let e=this._useScope;try{await this._flush();let t=await this.hass.callWS({type:"theme_studio/theme/use",slug:this._edit.slug,scope:e});this.dispatchEvent(new CustomEvent("settheme",{detail:{theme:e==="everyone"?"":t.theme},bubbles:!0,composed:!0})),this._dialog=void 0,this._libraryStale=!0,this._inUse=e==="everyone"?{everyone:[t.theme],device:""}:{...this._inUse,device:t.theme},this._showToast(e==="everyone"?a("toast.used_everyone",{name:t.theme}):a("toast.used_you",{name:t.theme}))}catch(t){this._showToast(a("toast.use_failed",{error:k(t)}))}finally{this._busy=!1}}async _export(e){if(!(!this.hass||!this._edit))try{await this._flush();let t=await this.hass.callWS({type:"theme_studio/theme/export",slug:this._edit.slug});if(e==="copy"){try{await navigator.clipboard.writeText(t.share_string),this._showToast(a("toast.share_copied"))}catch{this._importText=t.share_string,this._showToast(a("toast.share_blocked"))}return}let i=new Blob([`${JSON.stringify(t.document,null,2)}
`],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(i),o.download=t.file_name,o.click(),window.setTimeout(()=>URL.revokeObjectURL(o.href),2e3),this._showToast(a("toast.downloaded",{file:t.file_name}))}catch(t){this._showToast(a("toast.share_failed",{error:k(t)}))}}async _import(){if(!(!this.hass||!this._importText.trim())){this._busy=!0;try{let e=await this.hass.callWS({type:"theme_studio/theme/import",data:this._importText.trim()});this._dialog=void 0,this._importText="",this._libraryStale=!0,this._themes=void 0,this._loadThemes(),this._openTheme(e.slug),this._showToast(e.renamed?a("toast.imported_renamed",{name:e.name}):a("toast.imported",{name:e.name}))}catch(e){let t=e;this._showToast(t?.code&&t.code!=="unknown_error"?a("toast.import_invalid"):a("toast.import_failed",{error:k(e)}))}finally{this._busy=!1}}}async _delete(){if(!this.hass||!this._edit)return;this._busy=!0;let{slug:e,name:t}=this._edit;try{window.clearTimeout(this._saveTimer),this._dirty.clear(),this._nameDirty=!1,await this.hass.callWS({type:"theme_studio/theme/delete",slug:e}),this._dialog=void 0,this._libraryStale=!0,this._detailSlug=void 0,this._edit=void 0,this._navigate(this._prefix()),this._showToast(a("toast.deleted",{name:t}))}catch(i){this._showToast(a("toast.delete_failed",{error:k(i)}))}finally{this._busy=!1}}async _mirror(){if(!this.hass||!this._edit)return;let e=this._variant,t=e==="light"?"dark":"light";try{let i=await this.hass.callWS({type:"theme_studio/mirror",settings:this._edit.settings[e],target:t});this._replaceVariant(t,i.settings),this._showToast(a("toast.mirrored",{target:a(`variant.${t}`),source:a(`variant.${e}`)}))}catch(i){this._showToast(a("toast.mirror_failed",{error:k(i)}))}}async _createNew(){if(!this.hass)return;let e={type:"theme_studio/theme/new"};if(this._newName.trim()&&(e.name=this._newName.trim()),this._newMode==="image"){if(!this._newImage)return;e.image=this._newImage}else e.source=this._newMode==="colour"?"default":this._newSource,this._newMode==="colour"&&(e.base_color=this._newColour);this._busy=!0;try{let t=await this.hass.callWS(e);this._dialog=void 0,this._newName="",this._libraryStale=!0,this._themes=void 0,this._loadThemes(),this._openTheme(t.slug),this._showToast(a("toast.created",{name:t.name}))}catch(t){this._showToast(a("toast.create_failed",{error:k(t)}))}finally{this._busy=!1}}_isLinked(e){return!!(e.linkable&&this._edit&&this._linked.has(this._edit.slug))}_targets(e){return this._isLinked(e)?[...ae]:[this._variant]}_toggleLinked(){if(!this._edit)return;let e=new Set(this._linked);e.has(this._edit.slug)?e.delete(this._edit.slug):e.add(this._edit.slug),this._linked=e;try{window.localStorage.setItem(St,JSON.stringify([...e]))}catch{}}_tileSignature(e){let t=this._edit?.settings[this._variant]??{};return`${this._edit?.slug}|${this._variant}|${JSON.stringify({...t,[e.key]:""})}`}async _loadTiles(){if(!this.hass||!this._edit)return;let e=[...this._wantedTiles.values()];this._wantedTiles.clear();let t=++this._tileSeq,i=this._edit.settings[this._variant],o={};for(let s of e){let d=this._tileSignature(s);try{let u=await this.hass.callWS({type:"theme_studio/preview_options",settings:i,key:s.key,values:s.options.map(([h])=>h),fixed:s.fixed??{}});o[s.key]={signature:d,options:Object.fromEntries(u.options.map(h=>[h.value,h.variables]))}}catch{o[s.key]={signature:d,options:{}}}}t===this._tileSeq&&(this._tiles={...this._tiles,...o})}async _uploadImage(e,t){if(!this.hass?.fetchWithAuth){this._showToast(a("toast.upload_unsupported"));return}let i=new FormData;i.append("file",e,e.name),this._busy=!0;try{let o=await this.hass.fetchWithAuth(mr,{method:"POST",body:i}),s=await o.json().catch(()=>({}));if(!o.ok||!s.ok||!s.url){let d=br[s.reason??""];throw new Error(d?a(d):s.message??o.statusText)}return this._backgrounds=void 0,await this._loadBackgrounds(),t&&this._showToast(a("toast.uploaded",{file:s.file??""})),{url:s.url,file:s.file??s.url.split("/").pop()??""}}catch(o){this._showToast(a("toast.upload_failed",{error:k(o)}));return}finally{this._busy=!1}}async _upload(e,t){let i=await this._uploadImage(e,!0);i&&this._change(this._targets(t),{use_background_image:"on",background_image_url:i.url})}async _uploadForNew(e){let t=await this._uploadImage(e,!1);t&&(this._newImage=t.file)}_resolveProbe(){let e=this.renderRoot.querySelector(".probe"),t=e?.querySelector("span");if(!e||!t)return;let i={};for(let o of ae){let s=this._previews[o];if(!s)continue;e.removeAttribute("style");for(let[u,h]of Object.entries(De(s.variables)))e.style.setProperty(u,h);let d={};for(let u of ke)u.cssVar&&(t.style.color=`var(--${u.cssVar})`,d[u.id]=vr(getComputedStyle(t).color));i[o]=d}this._probe=i}_roleColour(e,t){let i=this._edit?.settings[t];if(i&&te(e,i))return z(ye(e,i))??ye(e,i);let o=this._previews[t];return e.summary&&o?String(o.summary[e.summary]).toUpperCase():this._probe[t]?.[e.id]??""}_language(){if(U(this._userData?.language))return this._userData.language;let e=this.panel?.config?.language;return U(e)?e:pt(this.hass?.locale?.language??this.hass?.language)}async _loadUserData(){if(this.hass){this._userDataLoading=!0;try{let e=await this.hass.callWS({type:"frontend/get_user_data",key:$t}),t=e?.value&&typeof e.value=="object"?e.value:{};this._userData={language:U(t.language)?t.language:void 0,tour:t.tour==="done"?"done":void 0},this._canEdit&&this._userData.tour!=="done"&&!this._tour&&(this._tour={kind:"welcome"})}catch{this._userData={tour:"done"}}finally{this._userDataLoading=!1}}}async _saveUserData(e){if(this._userData={...this._userData,...e},!!this.hass)try{await this.hass.callWS({type:"frontend/set_user_data",key:$t,value:this._userData})}catch{}}_pickLanguage(e){this._saveUserData({language:e})}_openGuide(){this._hint=!1,this._hintRect=void 0,this._dialog=void 0,this._tour={kind:"welcome"}}_tourTheme(){if(this._slug)return this._slug;let e=this._themes??[];return(e.find(t=>!t.builtin)??e.find(t=>t.slug==="glass")??e[0])?.slug}async _showStep(e,t){let i=E[e][t];if(i){if(this._dialog=void 0,this._tourRect=void 0,this._revealed=void 0,this._tour={kind:e,step:t},i.screen==="library"){this._slug&&await this._back();return}if(!this._slug){let o=this._tourTheme();o&&this._openTheme(o)}i.section&&(this._section=i.section)}}_tourNext(){let e=this._tour;!e||e.kind==="welcome"||(e.step+1<E[e.kind].length?this._showStep(e.kind,e.step+1):this._endTour())}_tourBack(){let e=this._tour;e&&e.kind!=="welcome"&&e.step>0&&this._showStep(e.kind,e.step-1)}_endTour(){let e=this._userData?.tour!=="done";this._tour=void 0,this._tourRect=void 0,this._revealed=void 0,this._saveUserData({tour:"done"}),e&&(this._hintRevealed=!1,this._hint=!0)}_visibleBox(){let e=this.getBoundingClientRect(),t=window.innerWidth||document.documentElement.clientWidth,i=window.visualViewport?.height??(window.innerHeight||document.documentElement.clientHeight),o=Math.max(0,e.left),s=Math.max(0,e.top),d=Math.min(t,e.right),u=Math.min(i,e.bottom);return{x:Math.round(o),y:Math.round(s),w:Math.round(Math.max(0,d-o)),h:Math.round(Math.max(0,u-s))}}_clipContext(){let e=[...this._themes??[]].sort((i,o)=>Number(i.builtin)-Number(o.builtin));return{base:z(String(this._edit?.settings[this._variant]?.base_color??""))??"#3A6EA5",cards:e.slice(0,2).map(i=>({name:i.name,light:i.light?.summary,dark:i.dark?.summary})),variant:this._variant}}_renderWelcome(){let e=this._language(),t=this._narrow,i=(o,s)=>l`<button class="tour-choice ${s?"main":""}" @click=${()=>void this._showStep(o,0)}>
      <span class="tour-meta">${a(`tour.${o}.meta`,{count:E[o].length})}</span>
      <strong>${p(o==="quick"?"wand":"grid",18)}${a(`tour.${o}`)}</strong>
      <span class="hint">${a(`tour.${o}.desc`)}</span>
    </button>`;return l`
      <div class="scrim ${t?"narrow":""}">
        <div class="dialog tour-welcome" role="dialog" aria-modal="true" aria-labelledby="ts-welcome" tabindex="-1">
          <div class="dhead">
            <div>
              <h2 class="sh" id="ts-welcome">${a("tour.welcome.title")}</h2>
              <p class="sp">${a("tour.welcome.body")}</p>
            </div>
            <button class="btn icon" aria-label=${a("tour.skip_all")} @click=${()=>this._endTour()}>${p("close",18)}</button>
          </div>
          <div class="tour-choices ${t?"narrow":""}">${i("quick",!0)}${i("full",!1)}</div>
          <div class="tour-section">
            <div class="lbl">${a("tour.language")}</div>
            <div class="tour-langs" role="group" aria-label=${a("tour.language")}>
              ${ut.map(o=>l`<button
                  class="tour-lang ${o.code===e?"on":""}"
                  lang=${o.code}
                  aria-pressed=${o.code===e?"true":"false"}
                  @click=${()=>this._pickLanguage(o.code)}
                >
                  ${o.label}
                </button>`)}
            </div>
            <p class="tour-note">${a("tour.language.note")}</p>
          </div>
          <div class="dfoot">
            <button class="linkish" @click=${()=>this._endTour()}>${a("tour.skip_all")}</button>
            <span class="hint">${a("tour.help_later")}</span>
          </div>
        </div>
      </div>
    `}_renderTourStep(e,t){let i=E[e],o=i[t],s=this._tourRect,d=this._tourBox??this._visibleBox(),u=yt(s,s?o.side:"center",d.w,d.h),h=t===i.length-1;return l`
      <div class="tour-layer" style=${b(this._boxStyle(d))} @click=${g=>g.stopPropagation()}>
        ${s?l`<div class="tour-spot" style=${b({left:`${s.x}px`,top:`${s.y}px`,width:`${s.w}px`,height:`${s.h}px`})}></div>`:l`<div class="tour-dim"></div>`}
        <div class="tour-pop" style=${b(u.style)} role="dialog" aria-modal="true" aria-labelledby="ts-tour-title" tabindex="-1">
          ${u.arrow?l`<div class="tour-arrow" style=${b(u.arrow)}></div>`:c}
          <div class="tour-inner">
            <div class="tour-top">
              <span class="tour-count">${a(`tour.chapter.${o.chapter}`)} · ${a("tour.step_of",{n:t+1,total:i.length})}</span>
            </div>
            <div class="clip" aria-hidden="true">${wt(o,this._clipContext())}</div>
            <h2 class="tour-title" id="ts-tour-title">${a(`tour.${o.id}.title`)}</h2>
            <p class="tour-body">${a(`tour.${o.id}.body`)}</p>
            <div class="tour-progress"><span style=${b({width:`${Math.round((t+1)/i.length*100)}%`})}></span></div>
            <div class="tour-foot">
              ${h?c:l`<button class="linkish" @click=${()=>this._endTour()}>${a("tour.skip")}</button>`}
              <span class="grow"></span>
              ${t>0?l`<button class="btn sm" @click=${()=>this._tourBack()}>${a("tour.back")}</button>`:c}
              ${h&&e==="quick"?l`<button class="btn sm" @click=${()=>void this._showStep("full",0)}>${a("tour.see_all")}</button>`:c}
              <button class="btn sm primary" @click=${()=>this._tourNext()}>${h?a("tour.done"):a("tour.next")}</button>
            </div>
          </div>
        </div>
      </div>
    `}_renderHint(){let e=this._hintRect,t=this._tourBox;if(!e||!t)return c;let i=Math.max(8,Math.min(t.w-288,e.x+e.w-280));return l`
      <div class="tour-hint-layer" style=${b(this._boxStyle(t))}>
        <div class="tour-ring" style=${b({left:`${e.x}px`,top:`${e.y}px`,width:`${e.w}px`,height:`${e.h}px`})}></div>
        <div class="tour-hint tour-pop" role="status" style=${b({left:`${i}px`,top:`${e.y+e.h+10}px`})}>
          <div class="tour-inner">
            <p class="tour-body">${a("tour.hint")}</p>
            <div class="tour-foot"><span class="grow"></span><button class="btn sm primary" @click=${this._dismissHint}>${a("tour.got_it")}</button></div>
          </div>
        </div>
      </div>
    `}_uploadTile(e){return l`<label class="image upload ${this._busy?"busy":""}">
      <span class="image-none">${p("upload",22)}</span><span>${this._busy?a("images.uploading"):a("images.upload")}</span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        ?disabled=${this._busy}
        @change=${t=>{let i=t.target,o=i.files?.[0];i.value="",o&&e(o)}}
      />
    </label>`}_reloadButton(e){return l`<button class="btn icon ${e}" data-tour="reload" @click=${this._refresh} aria-label=${a("lib.reload")} title=${a("lib.reload")}>
      ${p("refresh")}
    </button>`}_boxStyle(e){return{left:`${e.x}px`,top:`${e.y}px`,width:`${e.w}px`,height:`${e.h}px`}}_helpButton(e){return l`<button
      class="btn icon help ${e==="bar"?"hide-p":"only-p"}"
      data-tour="help"
      aria-label=${a("tour.help")}
      title=${a("tour.help")}
      @click=${()=>this._openGuide()}
    >
      ${p("help",20)}
    </button>`}render(){ht(this._language());let e=this._tour;return l`
      ${this._slug?this._renderEditor(this._slug):this._renderLibrary()}
      ${this._dialog==="new"?this._renderNewDialog():c}
      ${this._dialog==="delete"?this._renderDeleteDialog():c}
      ${this._dialog==="use"?this._renderUseDialog():c}
      ${this._dialog==="import"?this._renderImportDialog():c}
      ${e?.kind==="welcome"?this._renderWelcome():c}
      ${e&&e.kind!=="welcome"?this._renderTourStep(e.kind,e.step):c}
      ${this._hint&&!e?this._renderHint():c}
      ${this._toast?l`<div class="toast" role="status">${this._toast}</div>`:c}
    `}_renderLibrary(){let e=this._themes??[],t=e.filter(o=>this._filter==="all"?!0:this._filter==="mine"?!o.builtin:o.builtin),i=[{title:a("lib.group_mine"),items:t.filter(o=>!o.builtin)},{title:a("lib.group_builtin"),items:t.filter(o=>o.builtin)}].filter(o=>o.items.length>0);return l`
      <div class="shell">
        <header class="bar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <img class="logo" src=${gr} alt="" width="40" height="40" />
          <div class="titlebox">
            <div class="title">Theme Studio</div>
            <div class="status">${e.length?a("lib.themes_count",{count:e.length}):a("lib.tagline")}</div>
          </div>
          ${this._helpButton("bar")}
          ${this._reloadButton("hide-p")}
          ${this._canEdit?l`<button class="btn hide-p" data-tour="import" aria-label=${a("lib.import_label")} @click=${()=>this._dialog="import"}>
                ${p("download",18)}<span>${a("lib.import")}</span>
              </button>`:c}
          ${this._canEdit?l`<button
                class="btn primary"
                data-tour="new"
                aria-label=${a("lib.new_theme")}
                @click=${()=>{this._dialog="new",this._loadBackgrounds()}}
              >
                ${p("plus",18)}<span class="hide-p">${a("lib.new_theme")}</span>
              </button>`:c}
        </header>
        <main class="lib">
          <div class="lib-head">
            <div>
              <h1 class="lib-title">${a("lib.title")}</h1>
              <p class="sub">${a("lib.sub")}</p>
            </div>
            <div class="lib-tools">
              <div class="seg" data-tour="filter" role="group" aria-label=${a("lib.filter")}>
                ${this._filterButton("all",a("lib.all"))} ${this._filterButton("mine",a("lib.mine"))}
                ${this._filterButton("builtin",a("lib.builtin"))}
              </div>
              ${this._reloadButton("only-p")}${this._helpButton("phone")}
            </div>
          </div>
          ${this._error?l`<div class="message">
                <strong>${a("lib.load_failed")}</strong>
                <span class="hint">${this._error}</span>
                <button class="btn sm" @click=${this._refresh}>${a("common.try_again")}</button>
              </div>`:c}
          ${this._loading&&!this._themes?l`<div class="loading">${a("lib.loading")}</div>`:c}
          ${i.map(o=>l`
              <div class="gtitle">${o.title} · ${o.items.length}</div>
              <div class="grid">${o.items.map(s=>this._renderCard(s))}</div>
            `)}
        </main>
      </div>
    `}_filterButton(e,t){return l`<button
      class=${this._filter===e?"on":""}
      aria-pressed=${this._filter===e?"true":"false"}
      @click=${()=>{this._filter=e}}
    >
      ${t}
    </button>`}_renderCard(e){let t=(e.light?.failing??0)+(e.dark?.failing??0);return l`
      <button class="tcard" data-tour="card" @click=${()=>this._openTheme(e.slug)} aria-label=${a("lib.open",{name:e.name})}>
        <div class="mini">${this._renderMini(e.light)}${this._renderMini(e.dark)}</div>
        <div class="tmeta">
          <div class="tmeta-text">
            <div class="tname">${e.name}</div>
            <div class="tsub">${e.builtin?a("lib.card_builtin"):a("lib.card_mine")}</div>
          </div>
          ${this._inUseText(e.name)?l`<span class="badge">${this._inUseText(e.name)}</span>`:t?l`<span class="badge warn">${a("lib.to_check",{count:t})}</span>`:c}
        </div>
      </button>
    `}_renderMini(e){if(!e)return l`<div class="mini-v empty">–</div>`;let t=e.summary,i=`${Math.min(t.radius,14)*.5}px`;return l`
      <div class="mini-v" style=${b({background:fr(t)})}>
        <div class="mini-line" style=${b({background:t.text})}></div>
        <div class="mini-card" style=${b({background:t.card,borderRadius:i})}>
          <span class="mini-dot" style=${b({background:t.accent})}></span>
          <span class="mini-bar" style=${b({background:t.text})}></span>
        </div>
        <div class="mini-card" style=${b({background:t.card,borderRadius:i})}>
          <span class="mini-dot" style=${b({background:t.icon})}></span>
          <span class="mini-bar" style=${b({background:t.secondary})}></span>
        </div>
        <div class="mini-nav" style=${b({background:t.navbar})}></div>
      </div>
    `}_statusText(){if(!this._canEdit)return a("status.view_only");if(!this._edit)return a("common.loading");if(this._edit.builtin&&this._saveState==="saved")return a("status.builtin");switch(this._saveState){case"saving":return a("status.saving");case"unsaved":return a("status.unsaved");case"error":return a("status.error",{error:this._saveError??a("error.unknown")});default:return a("status.saved")}}_failing(e){return this._previews[e]?.contrast.filter(t=>!t.ok).length??0}_renderEditor(e){let t=this._edit?.slug===e||this._detailSlug===e?this._edit:void 0,i=this._themes?.find(u=>u.slug===e),o=t?.name??i?.name??e,s=this._failing(this._variant),d=O.find(u=>u.id===this._section)??O[0];return l`
      <div class="shell">
        <header class="bar">
          <button class="btn icon" @click=${()=>void this._back()} aria-label=${a("editor.back")}>${p("back")}</button>
          <div class="titlebox" data-tour="name">
            <input
              class="name"
              .value=${o}
              ?disabled=${!t||!this._canEdit}
              aria-label=${a("editor.name")}
              spellcheck="false"
              maxlength="60"
              @input=${u=>this._rename(u.target.value)}
            />
            <div class="status ${this._saveState==="error"?"error":""}">${this._statusText()}</div>
          </div>
          <button class="btn icon" data-tour="undo" aria-label=${a("editor.undo")} title=${a("editor.undo")} ?disabled=${!this._history.length} @click=${()=>this._restore("_history")}>
            ${p("undo",19)}
          </button>
          <button class="btn icon hide-p" data-tour="undo" aria-label=${a("editor.redo")} title=${a("editor.redo")} ?disabled=${!this._future.length} @click=${()=>this._restore("_future")}>
            ${p("redo",19)}
          </button>
          ${this._helpButton("bar")}
          <div class="seg" data-tour="variant" role="group" aria-label=${a("editor.variant")}>
            ${this._variantButton("light",a("variant.light"))} ${this._variantButton("dark",a("variant.dark"))}
          </div>
          ${t&&this._canEdit?l`
                <button class="btn primary" data-tour="use" ?disabled=${this._busy} aria-label=${a("editor.use")} @click=${()=>this._dialog="use"}>
                  ${p("check",18)}<span class="hide-t">${a("editor.use")}</span>
                </button>
              `:c}
        </header>
        ${this._detailError?l`<div class="message">
              <strong>${a("editor.load_failed",{name:o})}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${()=>void this._back()}>${a("editor.back")}</button>
            </div>`:l`<div class="editor">
              <nav class="rail" aria-label=${a("editor.sections")}>
                ${O.map(u=>l`<button class="rail-btn ${u.id===d.id?"on":""}" data-tour=${`section-${u.id}`} @click=${()=>this._section=u.id}>
                    ${p(u.icon,22)}${a(`section.${u.id}`)}
                    ${u.id==="check"&&s?l`<span class="count">${s}</span>`:c}
                  </button>`)}
              </nav>
              <section class="ctl" aria-label=${a("editor.controls")}>
                <div class="chips" role="group" aria-label=${a("editor.sections")}>
                  ${O.map(u=>l`<button class="chip ${u.id===d.id?"on":""}" data-tour=${`section-${u.id}`} @click=${()=>this._section=u.id}>
                      ${a(`section.${u.id}`)}
                      ${u.id==="check"&&s?l`<span class="count">${s}</span>`:c}
                    </button>`)}
                  ${this._helpButton("phone")}
                </div>
                ${t?.builtin&&this._canEdit?l`<div class="banner">
                      ${p("lock",18)}
                      <span>${a("editor.builtin_banner")}</span>
                    </div>`:c}
                ${t&&this._schema.size?l`<div class="sec">
                      <div>
                        <h2 class="sh">${a(`section.${d.id}`)}</h2>
                        <p class="sp">${a(`section.${d.id}.description`)}</p>
                      </div>
                      ${d.linkable&&this._canEdit?this._renderLinkRow(d):c}
                      ${d.id==="check"?this._renderCheck():d.groups.map(u=>this._renderGroup(u,d))}
                      ${!t.builtin&&this._canEdit?l`<div class="sec-foot">
                            <button class="btn danger" data-tour="delete" @click=${()=>this._dialog="delete"}>${p("trash",18)}${a("editor.delete")}</button>
                          </div>`:c}
                    </div>`:l`<div class="loading">${a("common.loading")}</div>`}
              </section>
              ${this._renderPreview()}
              <div class="probe" aria-hidden="true"><span></span></div>
            </div>`}
      </div>
    `}_variantButton(e,t){let i=this._variant===e;return l`<button
      class=${i?"on":""}
      aria-pressed=${i?"true":"false"}
      @click=${()=>{this._variant=e,this._hexDraft=void 0}}
    >
      ${p(e==="light"?"sun":"moon",17)}<span class="hide-p">${t}</span>
    </button>`}_renderLinkRow(e){let t=this._isLinked(e);return l`<button class="toggle-row" data-tour="link" aria-pressed=${t?"true":"false"} @click=${()=>this._toggleLinked()}>
      <span class="tr-text">
        <span class="tr-title">${a("link.title")}</span>
        <span class="hint">${t?a("link.on"):a("link.off",{variant:a(`variant.${this._variant}`)})}</span>
      </span>
      <span class="switch ${t?"on":""}" aria-hidden="true"></span>
    </button>`}_renderGroup(e,t){let i=!e.collapsible||this._open.has(e.id),o=()=>{let s=new Set(this._open);s.has(e.id)?s.delete(e.id):s.add(e.id),this._open=s};return l`
      <div class="group" data-tour=${`group-${e.id}`}>
        ${e.collapsible?l`<button class="group-head ${i?"open":""}" aria-expanded=${i?"true":"false"} @click=${o}>
              <span class="h">${f(`group.${e.id}`,e.title)}</span>${p("chevron",18)}
            </button>`:l`<div class="h">${f(`group.${e.id}`,e.title)}</div>`}
        ${i?e.controls.map(s=>this._renderControl(s,t)):c}
        ${i&&e.hint?l`<p class="hint">${f(`group.${e.id}.hint`,e.hint)}</p>`:c}
      </div>
    `}_renderControl(e,t){let i=this._edit?.settings[this._variant];if(!i)return c;let o=this._targets(t);switch(e.type){case"base":return this._renderBase(i);case"slider":return this._renderSlider(e,i,o);case"segmented":return this._renderSegmented(e,i,o);case"roles":return l`<div class="roles">${e.roles.map(s=>this._renderRole(s,i))}</div>`;case"mirror":return this._renderMirror();case"switch":return this._renderSwitch(e,i,o);case"text":return this._renderText(e,i,o);case"tiles":return this._renderTiles(e,i,o);case"images":return this._renderImages(i,o,t);case"fonts":return this._renderFonts(i,o)}}_renderSwitch(e,t,i){let o=t[e.key]==="on"||t[e.key]===!0;return l`<button
      class="toggle-row"
      data-tour=${`ctl-${e.key}`}
      aria-pressed=${o?"true":"false"}
      ?disabled=${!this._canEdit}
      @click=${()=>this._change(i,{[e.key]:o?"off":"on"})}
    >
      <span class="tr-text">
        <span class="tr-title">${f(`ctl.${e.key}`,e.label)}</span>
        ${e.hint?l`<span class="hint">${e.hint}</span>`:c}
      </span>
      <span class="switch ${o?"on":""}" aria-hidden="true"></span>
    </button>`}_renderText(e,t,i){let o=`ts-${e.key}`;return l`<div class="field" data-tour=${`ctl-${e.key}`}>
      <label class="lbl" for=${o}>${f(`ctl.${e.key}`,e.label)}</label>
      <input
        id=${o}
        class="text-input plain"
        maxlength="255"
        spellcheck="false"
        .value=${String(t[e.key]??"")}
        placeholder=${e.placeholder??""}
        ?disabled=${!this._canEdit}
        @input=${s=>this._change(i,{[e.key]:s.target.value},`${e.key}-text`)}
      />
      ${e.hint?l`<p class="hint">${e.hint}</p>`:c}
    </div>`}_renderTiles(e,t,i){let o=String(t[e.key]??""),s=this._tiles[e.key];return(!s||s.signature!==this._tileSignature(e))&&this._wantedTiles.set(e.key,e),l`<div class="tiles" data-tour=${`ctl-${e.key}`}>
      ${e.options.map(([d,u])=>{let h=s?.options[d],g=h?b(De(h)):c;return l`<button
          class="tile ${o===d?"on":""}"
          aria-pressed=${o===d?"true":"false"}
          ?disabled=${!this._canEdit}
          @click=${()=>this._change(i,{[e.key]:d})}
        >
          <div class="tile-art ${e.preview}" style=${g}>
            ${e.preview==="overlay"?c:l`<div class="tile-card"></div>`}
          </div>
          <span class="tile-label">${f(`${e.preview}.${d}`,u)}</span>
        </button>`})}
    </div>`}_renderImages(e,t,i){let o=e.use_background_image==="on"||e.use_background_image===!0,s=String(e.background_image_url??""),d=this._backgrounds;return l`<div class="images" data-tour="images">
      <button
        class="image none ${o?"":"on"}"
        aria-pressed=${o?"false":"true"}
        ?disabled=${!this._canEdit}
        @click=${()=>this._change(t,{use_background_image:"off"})}
      >
        <span class="image-none">${p("close",22)}</span><span>${a("images.none")}</span>
      </button>
      ${(d??[]).map(u=>l`<button
          class="image ${o&&s===u.url?"on":""}"
          aria-pressed=${o&&s===u.url?"true":"false"}
          ?disabled=${!this._canEdit}
          @click=${()=>this._change(t,{use_background_image:"on",background_image_url:u.url})}
        >
          <img src=${u.url} alt="" loading="lazy" /><span>${u.file}</span>
        </button>`)}
      ${this._canEdit?this._uploadTile(u=>void this._upload(u,i)):c}
    </div>
    ${d===void 0?l`<p class="hint">${a("images.loading")}</p>`:c}`}_renderFonts(e,t){let i=e.use_custom_font==="on"||e.use_custom_font===!0,o=String(e.primary_font_family??"");return l`<div class="tiles" data-tour="fonts">
      ${Xe.map(([s,d])=>{let u=!i&&o===s;return l`<button
          class="tile ${u?"on":""}"
          aria-pressed=${u?"true":"false"}
          ?disabled=${!this._canEdit}
          @click=${()=>this._change(t,{primary_font_family:s,use_custom_font:"off"})}
        >
          <div class="font-art" style=${b({fontFamily:`"${s}", system-ui, sans-serif`})}>
            <span class="font-aa">Aa 21°</span><span class="font-sm">${a("mock.living_room")}</span>
          </div>
          <span class="tile-label">${f(`font.${s}`,d)}</span>
        </button>`})}
    </div>`}_renderBase(e){let t=z(String(e.base_color??""))??"#344334",i=o=>{let s=z(o);s&&this._change([this._variant],{base_color:s},`base_color-${this._variant}`)};return l`
      <div class="base">
        <label class="swatch-big" style=${b({background:t})}>
          <input
            type="color"
            class="cpick"
            .value=${t.toLowerCase()}
            ?disabled=${!this._canEdit}
            aria-label=${a("base.pick")}
            @input=${o=>{this._hexDraft=void 0,i(o.target.value)}}
          />
        </label>
        <div class="field" style="flex: 1; min-width: 0">
          <label class="lbl" for="ts-hex">${a("base.hex")}</label>
          <input
            id="ts-hex"
            class="text-input"
            .value=${this._hexDraft??t}
            ?disabled=${!this._canEdit}
            spellcheck="false"
            maxlength="7"
            @input=${o=>{let s=o.target.value;this._hexDraft=s,i(s)}}
            @blur=${()=>this._hexDraft=void 0}
          />
        </div>
      </div>
    `}_renderSlider(e,t,i){let o=this._schema.get(e.key);if(!o)return c;let s=Number(t[e.key]??o.default??0),d=`ts-${e.key}`;return l`
      <div class="field" data-tour=${`ctl-${e.key}`}>
        <div class="lbl">
          <label for=${d}>${f(`ctl.${e.key}`,e.label??o.label)}</label><span class="val">${Math.round(s)}${e.unit?` ${e.unit}`:""}</span>
        </div>
        <input
          id=${d}
          type="range"
          min=${o.min??0}
          max=${o.max??100}
          step=${o.step??1}
          .value=${String(s)}
          ?disabled=${!this._canEdit}
          @input=${u=>this._change(i,{[e.key]:Number(u.target.value)},`${e.key}-${i.join()}`)}
        />
        ${e.ends?l`<div class="ends"><span>${a(e.ends[0])}</span><span>${a(e.ends[1])}</span></div>`:c}
      </div>
    `}_renderSegmented(e,t,i){let o=this._schema.get(e.key);if(!o)return c;let s=String(t[e.key]??o.default??"");return l`
      <div class="field" data-tour=${`ctl-${e.key}`}>
        <div class="lbl">${f(`ctl.${e.key}`,e.label)}</div>
        <div class="seg full" role="group" aria-label=${f(`ctl.${e.key}`,e.label)}>
          ${e.options.filter(([d])=>o.options.includes(d)).map(([d,u])=>l`<button
                class=${s===d?"on":""}
                aria-pressed=${s===d?"true":"false"}
                ?disabled=${!this._canEdit}
                @click=${()=>this._change(i,{[e.key]:d})}
              >
                ${f(`opt.${d}`,u)}
              </button>`)}
        </div>
        ${e.hint?l`<p class="hint">${f(`ctl.${e.key}.hint`,e.hint)}</p>`:c}
      </div>
    `}_roleContrast(e){return(this._previews[this._variant]?.contrast??[]).filter(o=>ee[o.key]?.includes(e.id)).reduce((o,s)=>!o||s.ratio/s.minimum<o.ratio/o.minimum?s:o,void 0)}_renderRole(e,t){let i=te(e,t),o=this._roleColour(e,this._variant),s=this._roleContrast(e),u=(this._previews[this._variant]?.contrast??[]).filter(m=>ee[m.key]?.includes(e.id)).every(m=>m.ok),h=this._variant,g=Ee(e);return l`
      <div class="role">
        <div class="rs" style=${b({background:o||"transparent"})}>
          ${i?l`<input
                  type="color"
                  class="cpick"
                  .value=${(z(o)??"#000000").toLowerCase()}
                  ?disabled=${!this._canEdit}
                  aria-label=${a("role.pick",{role:g})}
                  @input=${m=>this._change([h],we(e,m.target.value.toUpperCase()),`role-${e.id}-${h}`)}
                /><span class="rs-lock" aria-hidden="true">${p("lock",12)}</span>`:c}
        </div>
        <div class="role-text">
          <div class="rn">${g}</div>
          <div class="role-meta">
            <span class="val">${i?a("role.manual"):a("role.auto")} · ${o||"\u2013"}</span>
            ${s?l`<span class=${u?"badge small":"badge small warn"} title=${a("role.lowest",{pair:Ct(s),minimum:s.minimum})}>${s.ratio.toFixed(1)}:1</span>`:c}
          </div>
        </div>
        <div class="mode" role="group" aria-label=${a("role.mode",{role:g})}>
          <button class=${i?"":"on"} ?disabled=${!this._canEdit} @click=${()=>i&&this._change([h],xe(e))}>${a("role.auto")}</button>
          <button
            class=${i?"on":""}
            ?disabled=${!this._canEdit||!z(o)}
            @click=${()=>{let m=z(o);!i&&m&&this._change([h],we(e,m))}}
          >
            ${a("role.manual")}
          </button>
        </div>
      </div>
    `}_renderMirror(){let e=a(`variant.${this._variant}`),t=a(`variant.${this._variant==="light"?"dark":"light"}`);return l`
      <button class="btn" ?disabled=${!this._canEdit} @click=${()=>void this._mirror()}>
        ${p("swap",18)}${a("mirror.button",{target:t,source:e})}
      </button>
      <p class="hint">${a("mirror.hint",{target:t,source:e})}</p>
    `}_renderCheck(){let e=this._edit?.settings[this._variant],t=this._previews[this._variant];if(!e||!t)return l`<div class="loading">${a("common.loading")}</div>`;let i=this._previews.light,o=this._previews.dark;return l`
      <div class="sumrow">
        <span class="sumpill">${a("check.light",{summary:i?At(i.contrast):"\u2013"})}</span>
        <span class="sumpill">${a("check.dark",{summary:o?At(o.contrast):"\u2013"})}</span>
      </div>
      <div class="roles" data-tour="check-list">
        ${t.contrast.map(s=>{let d=(ee[s.key]??[]).map(u=>ke.find(h=>h.id===u)).filter(u=>!!(u&&te(u,e)));return l`
            <div class="crow">
              <div class="row-text">
                <div class="rn">${Ct(s)}</div>
                <div class="val">${a("check.ratio",{ratio:s.ratio.toFixed(1),minimum:s.minimum})}</div>
                ${!s.ok&&d.length?l`<div class="hint">${a("check.manual",{roles:d.map(Ee).join(", ")})}</div>`:c}
              </div>
              ${s.ok?l`<span class="badge">${a("check.readable")}</span>`:d.length&&this._canEdit?l`<button
                      class="btn sm"
                      @click=${()=>{let u=Object.assign({},...d.map(h=>xe(h)));this._change([this._variant],u),this._showToast(a("toast.set_auto",{roles:d.map(Ee).join(", ")}))}}
                    >
                      ${p("wand",16)}${a("check.use_auto")}
                    </button>`:l`<span class="badge warn">${a("check.low")}</span>`}
            </div>
          `})}
      </div>
      <p class="hint">${a("check.hint")}</p>
    `}_renderPreview(){return l`
      <section class="pv" data-tour="preview" aria-label=${a("preview.label")}>
        <div class="pv-bar">
          <span class="grow"></span>
          <button
            class=${this._both?"btn on":"btn"}
            aria-pressed=${this._both?"true":"false"}
            @click=${()=>{this._both=!this._both}}
          >
            ${p("split",18)}<span class="hide-p">${a("preview.both")}</span>
          </button>
          <div class="seg hide-p" role="group" aria-label=${a("preview.size")}>
            ${this._deviceButton("phone",a("device.phone"))} ${this._deviceButton("tablet",a("device.tablet"))}
            ${this._deviceButton("desktop",a("device.desktop"))}
          </div>
        </div>
        <div class="stage">${this._renderFrames()}</div>
      </section>
    `}_deviceButton(e,t){let i=this._device===e&&!this._both;return l`<button
      class=${i?"on":""}
      aria-pressed=${i?"true":"false"}
      aria-label=${t}
      title=${t}
      @click=${()=>{this._device=e,this._both=!1}}
    >
      ${p(e,17)}
    </button>`}_renderFrames(){let e=this._both?["light","dark"]:[this._variant],t=this._both?"phone":this._device;return e.map(i=>{let o=this._previews[i];return l`
        <div class="fwrap">
          <div class="flabel">${a(`variant.${i}`)}</div>
          ${o?l`<div class="frame ${t}" style=${b(De(o.variables))}>${gt(o.variables["theme-studio-background-attachment"]==="scroll")}</div>`:l`<div class="frame ${t}"><div class="loading">${a("common.loading")}</div></div>`}
        </div>
      `})}_renderNewDialog(){let e=this._themes??[],t=e.find(d=>d.slug===this._newSource)?.name,i=this._backgrounds?.find(d=>d.file===this._newImage),o=this._newMode==="preset"&&t?a("new.placeholder_preset",{name:t}):this._newMode==="image"&&i?a("new.placeholder_image",{name:i.file.replace(/\.[a-z0-9]+$/i,"")}):a("new.placeholder"),s=(d,u,h,g)=>l`<button
      class="opt ${this._newMode===d?"on":""}"
      aria-pressed=${this._newMode===d?"true":"false"}
      @click=${()=>this._newMode=d}
    >
      ${p(g,22)}<span class="ot">${u}</span><span class="hint">${h}</span>
    </button>`;return l`
      <div class="scrim ${this._narrow?"narrow":""}" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${a("new.title")} @click=${d=>d.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${a("new.title")}</h2>
              <p class="sp">${a("new.sub")}</p>
            </div>
            <button class="btn icon" aria-label=${a("common.close")} @click=${this._closeDialog}>${p("close",18)}</button>
          </div>
          <div class="opts">
            ${s("preset",a("new.preset"),a("new.preset_hint"),"grid")}
            ${s("colour",a("new.colour"),a("new.colour_hint"),"palette")}
            ${s("image",a("new.image"),a("new.image_hint"),"image")}
          </div>
          ${this._narrow&&this._canEdit?l`<div class="opts one">
                <button class="opt" @click=${()=>this._dialog="import"}>
                  ${p("download",22)}<span class="ot">${a("lib.import_label")}</span><span class="hint">${a("new.import_hint")}</span>
                </button>
              </div>`:c}
          ${this._newMode==="preset"?l`<div class="field">
                <label class="lbl" for="ts-source">${a("new.start_from")}</label>
                <select
                  id="ts-source"
                  class="text-input"
                  .value=${this._newSource}
                  @change=${d=>this._newSource=d.target.value}
                >
                  ${e.map(d=>l`<option value=${d.slug} ?selected=${d.slug===this._newSource}>
                      ${d.builtin?d.name:a("new.mine_option",{name:d.name})}
                    </option>`)}
                </select>
              </div>`:c}
          ${this._newMode==="colour"?l`<div class="base">
                <label class="swatch-big" style=${b({background:this._newColour})}>
                  <input
                    type="color"
                    class="cpick"
                    .value=${this._newColour.toLowerCase()}
                    aria-label=${a("base.pick")}
                    @input=${d=>this._newColour=d.target.value.toUpperCase()}
                  />
                </label>
                <div class="field">
                  <span class="lbl">${a("new.base")}</span>
                  <span class="val">${this._newColour}</span>
                </div>
              </div>`:c}
          ${this._newMode==="image"?this._backgrounds===void 0?l`<div class="loading">${a("images.loading")}</div>`:l`<div class="images">
                    ${this._backgrounds.map(d=>l`<button
                        class="image ${d.file===this._newImage?"on":""}"
                        aria-pressed=${d.file===this._newImage?"true":"false"}
                        @click=${()=>this._newImage=d.file}
                      >
                        <img src=${d.url} alt="" loading="lazy" /><span>${d.file}</span>
                      </button>`)}
                    ${this._uploadTile(d=>void this._uploadForNew(d))}
                  </div>
                  ${this._backgrounds.length?c:l`<p class="hint">${a("new.no_images")}</p>`}`:c}
          <div class="field">
            <label class="lbl" for="ts-newname">${a("new.name")}</label>
            <input
              id="ts-newname"
              class="text-input plain"
              maxlength="60"
              .value=${this._newName}
              placeholder=${o}
              @input=${d=>this._newName=d.target.value}
            />
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>${a("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy||this._newMode==="image"&&!this._newImage} @click=${()=>void this._createNew()}>
              ${a("new.create")}
            </button>
          </div>
        </div>
      </div>
    `}_renderUseDialog(){let e=this._edit?.name??"",t=(i,o,s,d)=>l`<button
      class="opt ${this._useScope===i?"on":""}"
      aria-pressed=${this._useScope===i?"true":"false"}
      @click=${()=>this._useScope=i}
    >
      ${p(o,22)}<span class="ot">${s}</span><span class="hint">${d}</span>
    </button>`;return l`
      <div class="scrim ${this._narrow?"narrow":""}" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${a("editor.use")} @click=${i=>i.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${a("use.title",{name:e})}</h2>
              <p class="sp">${a("use.sub")}</p>
            </div>
            <button class="btn icon" aria-label=${a("common.close")} @click=${this._closeDialog}>${p("close",18)}</button>
          </div>
          <div class="opts two">
            ${t("device","phone",a("use.me"),a("use.me_hint"))}
            ${t("everyone","home",a("use.everyone"),a("use.everyone_hint"))}
          </div>
          <p class="hint">${a("use.again")}</p>
          <div class="field">
            <div class="lbl">${a("use.share")}</div>
            <div class="share-row">
              <button class="btn" @click=${()=>void this._export("copy")}>${p("copy",18)}${a("use.copy")}</button>
              <button class="btn" @click=${()=>void this._export("download")}>${p("download",18)}${a("use.download")}</button>
            </div>
            <p class="hint">${a("use.share_hint")}</p>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>${a("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${()=>void this._use()}>
              ${this._busy?a("use.working"):a("editor.use")}
            </button>
          </div>
        </div>
      </div>
    `}_renderImportDialog(){return l`
      <div class="scrim ${this._narrow?"narrow":""}" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${a("import.title")} @click=${e=>e.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${a("import.title")}</h2>
              <p class="sp">${a("import.sub")}</p>
            </div>
            <button class="btn icon" aria-label=${a("common.close")} @click=${this._closeDialog}>${p("close",18)}</button>
          </div>
          <div class="field">
            <label class="lbl" for="ts-import">${a("import.field")}</label>
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
            ${p("upload",18)}${a("import.file")}
            <input
              type="file"
              accept=".json,.txt,application/json,text/plain"
              @change=${async e=>{let t=e.target,i=t.files?.[0];t.value="",i&&(this._importText=(await i.text()).slice(0,3e5))}}
            />
          </label>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>${a("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy||!this._importText.trim()} @click=${()=>void this._import()}>
              ${a("import.button")}
            </button>
          </div>
        </div>
      </div>
    `}_renderDeleteDialog(){let e=this._edit?.name??"";return l`
      <div class="scrim ${this._narrow?"narrow":""}" @click=${this._closeDialog}>
        <div class="dialog" role="alertdialog" aria-modal="true" aria-label=${a("editor.delete")} @click=${t=>t.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${a("delete.title",{name:e})}</h2>
              <p class="sp">${a("delete.sub")}</p>
            </div>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>${a("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${()=>void this._delete()}>${p("trash",18)}${a("delete.button")}</button>
          </div>
        </div>
      </div>
    `}};W.properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1},_themes:{state:!0},_loading:{state:!0},_error:{state:!0},_filter:{state:!0},_detailError:{state:!0},_variant:{state:!0},_both:{state:!0},_device:{state:!0},_edit:{state:!0},_previews:{state:!0},_probe:{state:!0},_section:{state:!0},_open:{state:!0},_saveState:{state:!0},_saveError:{state:!0},_history:{state:!0},_future:{state:!0},_hexDraft:{state:!0},_dialog:{state:!0},_toast:{state:!0},_busy:{state:!0},_newMode:{state:!0},_newSource:{state:!0},_newColour:{state:!0},_newImage:{state:!0},_newName:{state:!0},_backgrounds:{state:!0},_linked:{state:!0},_useScope:{state:!0},_importText:{state:!0},_inUse:{state:!0},_tiles:{state:!0},_userData:{state:!0},_tour:{state:!0},_tourRect:{state:!0},_hintRect:{state:!0},_tourBox:{state:!0},_size:{state:!0},_hint:{state:!0}},W.styles=[ft,bt,rt,xt];customElements.get("theme-studio-panel")||customElements.define("theme-studio-panel",W);export{W as ThemeStudioPanel};
