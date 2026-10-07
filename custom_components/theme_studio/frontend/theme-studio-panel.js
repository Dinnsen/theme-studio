var L=globalThis,B=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),it=new WeakMap,E=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&it.set(e,t))}return t}toString(){return this.cssText}},st=r=>new E(typeof r=="string"?r:r+"",void 0,j),M=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,a)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[a+1],r[0]);return new E(e,r,j)},rt=(r,t)=>{if(B)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=L.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},V=B?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return st(e)})(r):r;var{is:Tt,defineProperty:Rt,getOwnPropertyDescriptor:Pt,getOwnPropertyNames:Ut,getOwnPropertySymbols:zt,getPrototypeOf:Ot}=Object,N=globalThis,at=N.trustedTypes,Ht=at?at.emptyScript:"",Lt=N.reactiveElementPolyfillSupport,C=(r,t)=>r,W={toAttribute(r,t){switch(t){case Boolean:r=r?Ht:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ot=(r,t)=>!Tt(r,t),nt={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),N.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Rt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:a}=Pt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let p=s?.call(this);a?.call(this,n),this.requestUpdate(t,p,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=Ot(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,i=[...Ut(e),...zt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(V(s))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:W).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let a=i.getPropertyOptions(s),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:W;this._$Em=s;let p=n.fromAttribute(e,a.type);this[s]=p??this._$Ej?.get(s)??p,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(t!==void 0){let n=this.constructor;if(s===!1&&(a=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??ot)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),a!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,a]of i){let{wrapped:n}=a,p=this[s];n!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,a,p)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[C("elementProperties")]=new Map,f[C("finalized")]=new Map,Lt?.({ReactiveElement:f}),(N.reactiveElementVersions??=[]).push("2.1.2");var G=globalThis,lt=r=>r,D=G.trustedTypes,dt=D?D.createPolicy("lit-html",{createHTML:r=>r}):void 0,vt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+$,Bt=`<${gt}>`,A=document,R=()=>A.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",X=Array.isArray,Nt=r=>X(r)||typeof r?.[Symbol.iterator]=="function",F=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,pt=/>/g,y=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ht=/'/g,mt=/"/g,ft=/^(?:script|style|textarea|title)$/i,Q=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),l=Q(1),tt=Q(2),ee=Q(3),x=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),ut=new WeakMap,w=A.createTreeWalker(A,129);function xt(r,t){if(!X(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var Dt=(r,t)=>{let e=r.length-1,i=[],s,a=t===2?"<svg>":t===3?"<math>":"",n=T;for(let p=0;p<e;p++){let o=r[p],m,u,d=-1,g=0;for(;g<o.length&&(n.lastIndex=g,u=n.exec(o),u!==null);)g=n.lastIndex,n===T?u[1]==="!--"?n=ct:u[1]!==void 0?n=pt:u[2]!==void 0?(ft.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=y):u[3]!==void 0&&(n=y):n===y?u[0]===">"?(n=s??T,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,m=u[1],n=u[3]===void 0?y:u[3]==='"'?mt:ht):n===mt||n===ht?n=y:n===ct||n===pt?n=T:(n=y,s=void 0);let b=n===y&&r[p+1].startsWith("/>")?" ":"";a+=n===T?o+Bt:d>=0?(i.push(m),o.slice(0,d)+vt+o.slice(d)+$+b):o+$+(d===-2?p:b)}return[xt(r,a+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},U=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,n=0,p=t.length-1,o=this.parts,[m,u]=Dt(t,e);if(this.el=r.createElement(m,i),w.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=w.nextNode())!==null&&o.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(vt)){let g=u[n++],b=s.getAttribute(d).split($),H=/([.?@])?(.*)/.exec(g);o.push({type:1,index:a,name:H[2],strings:b,ctor:H[1]==="."?K:H[1]==="?"?Y:H[1]==="@"?J:S}),s.removeAttribute(d)}else d.startsWith($)&&(o.push({type:6,index:a}),s.removeAttribute(d));if(ft.test(s.tagName)){let d=s.textContent.split($),g=d.length-1;if(g>0){s.textContent=D?D.emptyScript:"";for(let b=0;b<g;b++)s.append(d[b],R()),w.nextNode(),o.push({type:2,index:++a});s.append(d[g],R())}}}else if(s.nodeType===8)if(s.data===gt)o.push({type:2,index:a});else{let d=-1;for(;(d=s.data.indexOf($,d+1))!==-1;)o.push({type:7,index:a}),d+=$.length-1}a++}}static createElement(t,e){let i=A.createElement("template");return i.innerHTML=t,i}};function k(r,t,e=r,i){if(t===x)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,a=P(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=k(r,s._$AS(r,t.values),s,i)),t}var q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);w.currentNode=s;let a=w.nextNode(),n=0,p=0,o=i[0];for(;o!==void 0;){if(n===o.index){let m;o.type===2?m=new z(a,a.nextSibling,this,t):o.type===1?m=new o.ctor(a,o.name,o.strings,this,t):o.type===6&&(m=new Z(a,this,t)),this._$AV.push(m),o=i[++p]}n!==o?.index&&(a=w.nextNode(),n++)}return w.currentNode=A,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),P(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=U.createElement(xt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let a=new q(s,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=ut.get(t.strings);return e===void 0&&ut.set(t.strings,e=new U(t)),e}k(t){X(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let a of t)s===e.length?e.push(i=new r(this.O(R()),this.O(R()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=lt(t).nextSibling;lt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,s){let a=this.strings,n=!1;if(a===void 0)t=k(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else{let p=t,o,m;for(t=a[0],o=0;o<a.length-1;o++)m=k(this,p[i+o],e,o),m===x&&(m=this._$AH[o]),n||=!P(m)||m!==this._$AH[o],m===c?t=c:t!==c&&(t+=(m??"")+a[o+1]),this._$AH[o]=m}n&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},K=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},Y=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},J=class extends S{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=k(this,t,e,0)??c)===x)return;let i=this._$AH,s=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}};var It=G.litHtmlPolyfillSupport;It?.(U,z),(G.litHtmlVersions??=[]).push("3.3.3");var bt=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let a=e?.renderBefore??null;i._$litPart$=s=new z(t.insertBefore(R(),a),a,void 0,e??{})}return s._$AI(r),s};var et=globalThis,_=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};_._$litElement$=!0,_.finalized=!0,et.litElementHydrateSupport?.({LitElement:_});var jt=et.litElementPolyfillSupport;jt?.({LitElement:_});(et.litElementVersions??=[]).push("4.2.2");var $t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},_t=r=>(...t)=>({_$litDirective$:r,values:t}),I=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var yt="important",Vt=" !"+yt,v=_t(class extends I{constructor(r){if(super(r),r.type!==$t.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let i=r[e];return i==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let i of this.ft)t[i]==null&&(this.ft.delete(i),i.includes("-")?e.removeProperty(i):e[i]=null);for(let i in t){let s=t[i];if(s!=null){this.ft.add(i);let a=typeof s=="string"&&s.endsWith(Vt);i.includes("-")||a?e.setProperty(i,a?s.slice(0,-11):s,a?yt:""):e[i]=s}}return x}});var Wt={palette:"M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M15 7.8h.01",back:"m15 18-6-6 6-6",refresh:"M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",sun:"M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",split:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM12 4v16",phone:"M9.5 2.5h5A2.5 2.5 0 0 1 17 5v14a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 19V5a2.5 2.5 0 0 1 2.5-2.5zM11 18h2",tablet:"M6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3zM11 18h2",desktop:"M4.5 4h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 21h8M12 17v4",bulb:"M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",thermo:"M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",home:"M3 11 12 4l9 7M5 10v10h14V10",image:"M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-9 9",lock:"M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3",edit:"M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"};function h(r,t=20){return l`<svg
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
    ${tt`<path d=${Wt[r]}></path>`}
  </svg>`}function wt(r=16){return l`<svg width=${r} height=${r} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    ${tt`<path d="M8 5v14l11-7z"></path>`}
  </svg>`}function At(){return l`
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
              <div class="m-play">${wt()}</div>
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
  `}var kt=M`
  .mock {
    position: absolute;
    inset: 0;
    overflow: hidden;
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    font-family: var(--primary-font-family, var(--ha-font-family-body, inherit));
    color: var(--primary-text-color);
    background: var(--lovelace-background, var(--primary-background-color));
    background-attachment: scroll;
  }
  .m-scroll {
    flex: 1;
    overflow: hidden;
    padding: 20px 14px 96px;
    display: flex;
    flex-direction: column;
    gap: 12px;
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
`;var St=M`
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
`;var Et="/theme-studio",Ft=/^\/theme\/([^/]+)/,qt=/^[a-z0-9-]+$/,Kt=/[;{}<>]/,Yt=[["page","Page background"],["card","Cards"],["bubble","Bubble cards"],["navbar","Navbar"],["accent","Accent"],["text","Text"],["secondary","Secondary text"],["icon","Icons"],["active","Active icons"]];function Mt(r){return r&&typeof r=="object"&&"message"in r?String(r.message):String(r)}function Jt(r){let t={};for(let[e,i]of Object.entries(r))qt.test(e)&&!Kt.test(i)&&(t[`--${e}`]=i);return t}function Zt(r){if(!r.image||!r.image.startsWith("/"))return r.page;let t=encodeURI(r.image).replace(/'/g,"%27");return`linear-gradient(${r.page}cc, ${r.page}cc), url('${t}') center / cover`}function Ct(r){let t=r.filter(e=>!e.ok).length;return t===0?`all ${r.length} readable`:`${t} of ${r.length} to check`}var O=class extends _{constructor(){super(),this.narrow=!1,this._loading=!1,this._filter="all",this._variant="light",this._both=!1,this._device="phone"}get _slug(){let t=Ft.exec(this.route?.path??"");return t?decodeURIComponent(t[1]):void 0}willUpdate(t){t.has("hass")&&this.hass&&(this.toggleAttribute("dark",!!this.hass.themes?.darkMode),!this._themes&&!this._loading&&!this._error&&this._loadThemes());let e=this._slug;this.hass&&e&&e!==this._detailSlug&&this._loadDetail(e)}async _loadThemes(){if(this.hass){this._loading=!0,this._error=void 0;try{let t=await this.hass.callWS({type:"theme_studio/themes"});this._themes=t.themes}catch(t){this._error=Mt(t)}finally{this._loading=!1}}}async _loadDetail(t){if(this.hass){this._detailSlug=t,this._detail=void 0,this._detailError=void 0;try{let e=await this.hass.callWS({type:"theme_studio/theme",slug:t});this._detailSlug===t&&(this._detail=e)}catch(e){this._detailSlug===t&&(this._detailError=Mt(e))}}}_navigate(t){window.history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_prefix(){return this.route?.prefix??"/theme-studio-panel"}_open(t){this._navigate(`${this._prefix()}/theme/${encodeURIComponent(t)}`)}_back(){this._navigate(this._prefix())}_refresh(){this._themes=void 0,this._error=void 0,this._loadThemes()}render(){return this._slug?this._renderTheme(this._slug):this._renderLibrary()}_renderLibrary(){let t=this._themes??[],e=t.filter(s=>this._filter==="all"?!0:this._filter==="mine"?!s.builtin:s.builtin),i=[{title:"Mine",items:e.filter(s=>!s.builtin)},{title:"Built-in presets",items:e.filter(s=>s.builtin)}].filter(s=>s.items.length>0);return l`
      <div class="shell">
        <header class="bar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="logo">${h("palette",22)}</div>
          <div class="titlebox">
            <div class="title">Theme Studio</div>
            <div class="status">${t.length?`${t.length} themes \xB7 light and dark`:"Themes for Home Assistant"}</div>
          </div>
          <button class="btn icon" @click=${this._refresh} aria-label="Reload themes" title="Reload themes">
            ${h("refresh")}
          </button>
        </header>
        <main class="lib">
          <div class="lib-head">
            <div>
              <h1 class="lib-title">Your themes</h1>
              <p class="sub">Open a theme to see it in light and dark on a phone, a tablet or a computer.</p>
            </div>
            <div class="seg" role="group" aria-label="Show">
              ${this._filterButton("all","All")} ${this._filterButton("mine","Mine")}
              ${this._filterButton("builtin","Built-in")}
            </div>
          </div>
          <div class="notice">
            ${h("info")}
            <div class="notice-text">
              <strong>This is the new studio, so far for looking only.</strong> Editing moves here in a
              coming version. Until then, change themes in the Theme Studio dashboard.
            </div>
            <button class="btn sm" @click=${()=>this._navigate(Et)}>Open dashboard</button>
          </div>
          ${this._error?l`<div class="message">
                <strong>Could not load the themes</strong>
                <span class="hint">${this._error}</span>
                <button class="btn sm" @click=${this._refresh}>Try again</button>
              </div>`:c}
          ${this._loading&&!this._themes?l`<div class="loading">Loading themes…</div>`:c}
          ${i.map(s=>l`
              <div class="gtitle">${s.title} · ${s.items.length}</div>
              <div class="grid">${s.items.map(a=>this._renderCard(a))}</div>
            `)}
        </main>
      </div>
    `}_filterButton(t,e){return l`<button
      class=${this._filter===t?"on":""}
      aria-pressed=${this._filter===t?"true":"false"}
      @click=${()=>{this._filter=t}}
    >
      ${e}
    </button>`}_renderCard(t){let e=(t.light?.failing??0)+(t.dark?.failing??0);return l`
      <button class="tcard" @click=${()=>this._open(t.slug)} aria-label=${`Open ${t.name}`}>
        <div class="mini">${this._renderMini(t.light)}${this._renderMini(t.dark)}</div>
        <div class="tmeta">
          <div class="tmeta-text">
            <div class="tname">${t.name}</div>
            <div class="tsub">${t.builtin?"Built-in preset":"Mine"}</div>
          </div>
          ${e?l`<span class="badge warn">${e} to check</span>`:c}
        </div>
      </button>
    `}_renderMini(t){if(!t)return l`<div class="mini-v empty">–</div>`;let e=t.summary,i=`${Math.min(e.radius,14)*.5}px`;return l`
      <div class="mini-v" style=${v({background:Zt(e)})}>
        <div class="mini-line" style=${v({background:e.text})}></div>
        <div class="mini-card" style=${v({background:e.card,borderRadius:i})}>
          <span class="mini-dot" style=${v({background:e.accent})}></span>
          <span class="mini-bar" style=${v({background:e.text})}></span>
        </div>
        <div class="mini-card" style=${v({background:e.card,borderRadius:i})}>
          <span class="mini-dot" style=${v({background:e.icon})}></span>
          <span class="mini-bar" style=${v({background:e.secondary})}></span>
        </div>
        <div class="mini-nav" style=${v({background:e.navbar})}></div>
      </div>
    `}_renderTheme(t){let e=this._detail?.slug===t?this._detail:void 0,i=this._themes?.find(p=>p.slug===t),s=e?.name??i?.name??t,a=e?.builtin??i?.builtin??!1,n=e?.[this._variant]??null;return l`
      <div class="shell">
        <header class="bar">
          <button class="btn icon" @click=${this._back} aria-label="Back to all themes">${h("back")}</button>
          <div class="titlebox">
            <div class="title">${s}</div>
            <div class="status">${a?"Built-in preset":"Mine"} · read-only preview</div>
          </div>
          <div class="seg" role="group" aria-label="Variant">
            ${this._variantButton("light","Light")} ${this._variantButton("dark","Dark")}
          </div>
        </header>
        ${this._detailError?l`<div class="message">
              <strong>Could not load ${s}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${this._back}>Back to all themes</button>
            </div>`:l`<div class="ed">
              <section class="info" aria-label="Details">
                ${e?this._renderInfo(e,n):l`<div class="loading">Loading…</div>`}
              </section>
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
                <div class="stage">${e?this._renderFrames(e):c}</div>
              </section>
            </div>`}
      </div>
    `}_variantButton(t,e){let i=this._variant===t&&!this._both;return l`<button
      class=${i?"on":""}
      aria-pressed=${i?"true":"false"}
      @click=${()=>{this._variant=t,this._both=!1}}
    >
      ${h(t==="light"?"sun":"moon",17)}<span class="hide-p">${e}</span>
    </button>`}_deviceButton(t,e){let i=this._device===t&&!this._both;return l`<button
      class=${i?"on":""}
      aria-pressed=${i?"true":"false"}
      aria-label=${e}
      title=${e}
      @click=${()=>{this._device=t,this._both=!1}}
    >
      ${h(t,17)}
    </button>`}_renderFrames(t){let e=this._both?["light","dark"]:[this._variant],i=this._both?"phone":this._device;return e.map(s=>{let a=t[s];return l`
        <div class="fwrap">
          <div class="flabel">${s==="light"?"Light":"Dark"}</div>
          ${a?l`<div class="frame ${i}" style=${v(Jt(a.variables))}>${At()}</div>`:l`<div class="frame ${i}"><div class="loading">This variant could not be built.</div></div>`}
        </div>
      `})}_renderInfo(t,e){let i=this._variant==="light"?"Light":"Dark";return l`
      <div>
        <div class="h">Colours · ${i}</div>
        ${e?l`<div class="list">
              ${Yt.map(([s,a])=>l`
                  <div class="row">
                    <span class="sw" style=${v({background:String(e.summary[s])})}></span>
                    <div class="row-text">
                      <div class="rn">${a}</div>
                      <div class="val">${String(e.summary[s]).toUpperCase()}</div>
                    </div>
                  </div>
                `)}
            </div>`:l`<p class="hint">This variant could not be built.</p>`}
      </div>
      <div>
        <div class="h">Check</div>
        <div class="sumrow">
          <span class="sumpill">Light · ${t.light?Ct(t.light.contrast):"\u2013"}</span>
          <span class="sumpill">Dark · ${t.dark?Ct(t.dark.contrast):"\u2013"}</span>
        </div>
        ${e?l`<div class="list">
              ${e.contrast.map(s=>l`
                  <div class="row">
                    <div class="row-text">
                      <div class="rn">${s.label}</div>
                      <div class="val">${s.ratio.toFixed(1)}:1 · needs ${s.minimum}:1</div>
                    </div>
                    <span class=${s.ok?"badge":"badge warn"}>${s.ok?"Readable":"Low"}</span>
                  </div>
                `)}
            </div>`:c}
      </div>
      <div class="soon">
        <div class="rn">${h("edit",18)} Editing comes next</div>
        <p class="hint">
          In a coming version you change colours, surfaces and fonts right here. Until then, use the Theme Studio
          dashboard.
        </p>
        <button class="btn sm" @click=${()=>this._navigate(Et)}>Open dashboard</button>
      </div>
    `}};O.properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1},_themes:{state:!0},_loading:{state:!0},_error:{state:!0},_filter:{state:!0},_detail:{state:!0},_detailError:{state:!0},_variant:{state:!0},_both:{state:!0},_device:{state:!0}},O.styles=[St,kt];customElements.get("theme-studio-panel")||customElements.define("theme-studio-panel",O);export{O as ThemeStudioPanel};
