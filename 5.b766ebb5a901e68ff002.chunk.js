webpackJsonp([5],{jBSi:function(l,n,u){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=u("WT6e"),t=function(){function l(){}return l.forRoot=function(){return{ngModule:l,providers:[]}},l}(),a=u("INQx"),r=u("TBIh"),i=u("Xjw4"),o=u("7DMc"),d=u("YYA8"),_=u("Uo70"),s=u("704W"),c=u("XHgV"),m=u("LEdz"),f=u("AP/s"),g=u("U/+3"),h=u("RsmO"),p=u("BTH+"),b=u("gsbp"),v=u("6Hfd"),C=u("sZDk"),y=u("TToO"),S=u("bFof"),k=u("6Xmr");function x(l){return l&&l.substring?l.substring(0,10):l}function F(l){return l&&l.substring?l.substring(0,10):l}function w(l){return function(){return l}}var O=function(){function l(l){Object(k.plainToClassFromExist)(this,l)}return l.prototype.toString=function(){var l=[];return 0===l.length&&this.name&&l.push(this.name),l.join(" ")},l.strings={id:"Id",name:"Name",company:"Company"},l.fields=["id","name","company"],Object(y.b)([Object(S.IsNotEmpty)(),Object(y.d)("design:type",String)],l.prototype,"name",void 0),Object(y.b)([Object(S.ValidateNested)(),Object(S.IsOptional)(),Object(k.Type)(w(C.a)),Object(y.d)("design:type",C.a)],l.prototype,"company",void 0),l}(),I=function(){function l(l){this.department=new O,Object(k.plainToClassFromExist)(this,l)}return l.prototype.toString=function(){var l=[];return 0===l.length&&this.username&&l.push(this.username),l.join(" ")},l.strings={id:"Id",username:"Username",password:"Password",isSuperuser:"Administrator",isStaff:"Staff",email:"Email",department:"Department",dateOfBirth:"Date of birth"},l.fields=["id","username","password","isSuperuser","isStaff","email","department","dateOfBirth"],Object(y.b)([Object(S.IsNotEmpty)(),Object(y.d)("design:type",String)],l.prototype,"username",void 0),Object(y.b)([Object(S.IsEmail)(),Object(S.IsNotEmpty)(),Object(y.d)("design:type",String)],l.prototype,"email",void 0),Object(y.b)([Object(S.ValidateNested)(),Object(S.IsOptional)(),Object(k.Type)(w(O)),Object(y.d)("design:type",O)],l.prototype,"department",void 0),Object(y.b)([Object(k.Transform)(x,{toClassOnly:!0}),Object(k.Transform)(F,{toPlainOnly:!0}),Object(y.d)("design:type",String)],l.prototype,"dateOfBirth",void 0),l}(),j=function(){function l(){this.item=new I({username:"admin",isStaff:!0,id:1,isSuperuser:!0,dateOfBirth:"1985-05-11T01:00:00Z",password:"secretpassword",email:"admin@site15.ru",department:{id:2,name:"department 1",company:{id:3,name:"company 2"}}}),this.strings=I.strings,this.departmentStrings=O.strings,this.companyStrings=C.a.strings,this.fb=new v.a,this.form=this.fb.group(I,{username:"",email:"",dateOfBirth:"",isSuperuser:!1,isStaff:!1,department:this.fb.group(O,{name:"",company:this.fb.group(C.a,{name:""})})})}return l.prototype.onLoadExternalClick=function(){this.form.externalErrors={username:["external error"],department:{company:{name:["external error for name"]}}},this.form.validateAllFormFields()},l.prototype.onClearExternalClick=function(){this.form.externalErrors={},this.form.validateAllFormFields()},l.prototype.onLoadClick=function(){this.savedItem=void 0,this.form.object=this.item,this.form.validateAllFormFields()},l.prototype.onClearClick=function(){this.savedItem=void 0,this.form.object=new I,this.form.validateAllFormFields()},l.prototype.onSaveClick=function(){this.form.valid?this.savedItem=this.form.object:this.form.validateAllFormFields()},l}(),L=e._3({encapsulation:2,styles:[],data:{}});function E(l){return e._28(0,[(l()(),e._5(0,0,null,null,3,"mat-error",[["class","mat-error"],["role","alert"]],[[1,"id",0]],null,null,null,null)),e._4(1,16384,[[4,4]],0,r.a,[],null,null),(l()(),e._26(2,null,["\n      ","\n    "])),e._19(131072,i.b,[e.h])],null,function(l,n){var u=n.component;l(n,0,0,e._16(n,1).id),l(n,2,0,e._27(n,2,0,e._16(n,3).transform(null==u.form?null:u.form.customValidateErrors)).username.join(". "))})}function P(l){return e._28(0,[(l()(),e._5(0,0,null,null,3,"mat-error",[["class","mat-error"],["role","alert"]],[[1,"id",0]],null,null,null,null)),e._4(1,16384,[[11,4]],0,r.a,[],null,null),(l()(),e._26(2,null,["\n      ","\n    "])),e._19(131072,i.b,[e.h])],null,function(l,n){var u=n.component;l(n,0,0,e._16(n,1).id),l(n,2,0,e._27(n,2,0,e._16(n,3).transform(u.form.customValidateErrors)).email.join(". "))})}function q(l){return e._28(0,[(l()(),e._5(0,0,null,null,5,"mat-error",[["class","mat-error"],["role","alert"]],[[1,"id",0]],null,null,null,null)),e._4(1,16384,[[18,4]],0,r.a,[],null,null),(l()(),e._26(-1,null,["\n      date of birth is\n      "])),(l()(),e._5(3,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e._26(-1,null,["required"])),(l()(),e._26(-1,null,["\n    "]))],null,function(l,n){l(n,0,0,e._16(n,1).id)})}function T(l){return e._28(0,[(l()(),e._5(0,0,null,null,3,"mat-error",[["class","mat-error"],["role","alert"]],[[1,"id",0]],null,null,null,null)),e._4(1,16384,[[18,4]],0,r.a,[],null,null),(l()(),e._26(2,null,["\n      ","\n    "])),e._19(131072,i.b,[e.h])],null,function(l,n){var u=n.component;l(n,0,0,e._16(n,1).id),l(n,2,0,e._27(n,2,0,e._16(n,3).transform(u.form.customValidateErrors)).dateOfBirth.join(". "))})}function V(l){return e._28(0,[(l()(),e._5(0,0,null,null,3,"mat-error",[["class","mat-error"],["role","alert"]],[[1,"id",0]],null,null,null,null)),e._4(1,16384,[[25,4]],0,r.a,[],null,null),(l()(),e._26(2,null,["\n        ","\n      "])),e._19(131072,i.b,[e.h])],null,function(l,n){var u=n.component;l(n,0,0,e._16(n,1).id),l(n,2,0,e._27(n,2,0,e._16(n,3).transform(u.form.customValidateErrors)).department.name.join(". "))})}function D(l){return e._28(0,[(l()(),e._5(0,0,null,null,3,"mat-error",[["class","mat-error"],["role","alert"]],[[1,"id",0]],null,null,null,null)),e._4(1,16384,[[32,4]],0,r.a,[],null,null),(l()(),e._26(2,null,["\n          ","\n        "])),e._19(131072,i.b,[e.h])],null,function(l,n){var u=n.component;l(n,0,0,e._16(n,1).id),l(n,2,0,e._27(n,2,0,e._16(n,3).transform(u.form.customValidateErrors)).department.company.name.join(". "))})}function A(l){return e._28(0,[(l()(),e._5(0,0,null,null,3,"p",[],null,null,null,null,null)),(l()(),e._26(1,null,["Custom validation errors: ",""])),e._19(131072,i.b,[e.h]),e._19(0,i.f,[])],null,function(l,n){var u=n.component;l(n,1,0,e._27(n,1,0,e._16(n,3).transform(e._27(n,1,0,e._16(n,2).transform(u.form.customValidateErrors)))))})}function N(l){return e._28(0,[(l()(),e._5(0,0,null,null,2,"p",[],null,null,null,null,null)),(l()(),e._26(1,null,["Saved item: ",""])),e._19(0,i.f,[])],null,function(l,n){var u=n.component;l(n,1,0,e._27(n,1,0,e._16(n,2).transform(u.savedItem)))})}function B(l){return e._28(0,[(l()(),e._5(0,0,null,null,218,"form",[["novalidate",""]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"submit"],[null,"reset"]],function(l,n,u){var t=!0;return"submit"===n&&(t=!1!==e._16(l,2).onSubmit(u)&&t),"reset"===n&&(t=!1!==e._16(l,2).onReset()&&t),t},null,null)),e._4(1,16384,null,0,o.u,[],null,null),e._4(2,540672,null,0,o.i,[[8,null],[8,null]],{form:[0,"form"]},null),e._22(2048,null,o.c,null,[o.i]),e._4(4,16384,null,0,o.p,[o.c],null,null),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(6,0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),e._26(-1,null,["Group form"])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(9,0,null,null,22,"mat-form-field",[["class","full-width mat-input-container mat-form-field"]],[[2,"mat-input-invalid",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-focused",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,d.b,d.a)),e._4(10,7389184,null,7,r.b,[e.k,e.h,[2,_.e]],null,null),e._24(335544320,1,{_control:0}),e._24(335544320,2,{_placeholderChild:0}),e._24(335544320,3,{_labelChild:0}),e._24(603979776,4,{_errorChildren:1}),e._24(603979776,5,{_hintChildren:1}),e._24(603979776,6,{_prefixChildren:1}),e._24(603979776,7,{_suffixChildren:1}),(l()(),e._26(-1,1,["\n    "])),(l()(),e._5(19,0,null,1,7,"input",[["class","mat-input-element mat-form-field-autofill-control"],["formControlName","username"],["matInput",""]],[[2,"mat-input-server",null],[1,"id",0],[8,"placeholder",0],[8,"disabled",0],[8,"required",0],[8,"readOnly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,u){var t=!0;return"input"===n&&(t=!1!==e._16(l,20)._handleInput(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,20).onTouched()&&t),"compositionstart"===n&&(t=!1!==e._16(l,20)._compositionStart()&&t),"compositionend"===n&&(t=!1!==e._16(l,20)._compositionEnd(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,24)._focusChanged(!1)&&t),"focus"===n&&(t=!1!==e._16(l,24)._focusChanged(!0)&&t),"input"===n&&(t=!1!==e._16(l,24)._onInput()&&t),t},null,null)),e._4(20,16384,null,0,o.d,[e.C,e.k,[2,o.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[o.d]),e._4(22,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(24,933888,null,0,s.a,[e.k,c.a,[2,o.n],[2,o.q],[2,o.i],_.c,[8,null]],{placeholder:[0,"placeholder"]},null),e._4(25,16384,null,0,o.o,[o.n],null,null),e._22(2048,[[1,4]],r.c,null,[s.a]),(l()(),e._26(-1,1,["\n    "])),(l()(),e._0(16777216,null,5,2,null,E)),e._4(29,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),e._19(131072,i.b,[e.h]),(l()(),e._26(-1,1,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(33,0,null,null,22,"mat-form-field",[["class","full-width mat-input-container mat-form-field"]],[[2,"mat-input-invalid",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-focused",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,d.b,d.a)),e._4(34,7389184,null,7,r.b,[e.k,e.h,[2,_.e]],null,null),e._24(335544320,8,{_control:0}),e._24(335544320,9,{_placeholderChild:0}),e._24(335544320,10,{_labelChild:0}),e._24(603979776,11,{_errorChildren:1}),e._24(603979776,12,{_hintChildren:1}),e._24(603979776,13,{_prefixChildren:1}),e._24(603979776,14,{_suffixChildren:1}),(l()(),e._26(-1,1,["\n    "])),(l()(),e._5(43,0,null,1,7,"input",[["class","mat-input-element mat-form-field-autofill-control"],["formControlName","email"],["matInput",""],["type","email"]],[[2,"mat-input-server",null],[1,"id",0],[8,"placeholder",0],[8,"disabled",0],[8,"required",0],[8,"readOnly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,u){var t=!0;return"input"===n&&(t=!1!==e._16(l,44)._handleInput(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,44).onTouched()&&t),"compositionstart"===n&&(t=!1!==e._16(l,44)._compositionStart()&&t),"compositionend"===n&&(t=!1!==e._16(l,44)._compositionEnd(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,48)._focusChanged(!1)&&t),"focus"===n&&(t=!1!==e._16(l,48)._focusChanged(!0)&&t),"input"===n&&(t=!1!==e._16(l,48)._onInput()&&t),t},null,null)),e._4(44,16384,null,0,o.d,[e.C,e.k,[2,o.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[o.d]),e._4(46,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(48,933888,null,0,s.a,[e.k,c.a,[2,o.n],[2,o.q],[2,o.i],_.c,[8,null]],{placeholder:[0,"placeholder"],type:[1,"type"]},null),e._4(49,16384,null,0,o.o,[o.n],null,null),e._22(2048,[[8,4]],r.c,null,[s.a]),(l()(),e._26(-1,1,["\n    "])),(l()(),e._0(16777216,null,5,2,null,P)),e._4(53,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),e._19(131072,i.b,[e.h]),(l()(),e._26(-1,1,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(57,0,null,null,25,"mat-form-field",[["class","full-width mat-input-container mat-form-field"]],[[2,"mat-input-invalid",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-focused",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,d.b,d.a)),e._4(58,7389184,null,7,r.b,[e.k,e.h,[2,_.e]],null,null),e._24(335544320,15,{_control:0}),e._24(335544320,16,{_placeholderChild:0}),e._24(335544320,17,{_labelChild:0}),e._24(603979776,18,{_errorChildren:1}),e._24(603979776,19,{_hintChildren:1}),e._24(603979776,20,{_prefixChildren:1}),e._24(603979776,21,{_suffixChildren:1}),(l()(),e._26(-1,1,["\n    "])),(l()(),e._5(67,0,null,1,7,"input",[["class","mat-input-element mat-form-field-autofill-control"],["formControlName","dateOfBirth"],["matInput",""],["type","date"]],[[2,"mat-input-server",null],[1,"id",0],[8,"placeholder",0],[8,"disabled",0],[8,"required",0],[8,"readOnly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,u){var t=!0;return"input"===n&&(t=!1!==e._16(l,68)._handleInput(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,68).onTouched()&&t),"compositionstart"===n&&(t=!1!==e._16(l,68)._compositionStart()&&t),"compositionend"===n&&(t=!1!==e._16(l,68)._compositionEnd(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,72)._focusChanged(!1)&&t),"focus"===n&&(t=!1!==e._16(l,72)._focusChanged(!0)&&t),"input"===n&&(t=!1!==e._16(l,72)._onInput()&&t),t},null,null)),e._4(68,16384,null,0,o.d,[e.C,e.k,[2,o.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[o.d]),e._4(70,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(72,933888,null,0,s.a,[e.k,c.a,[2,o.n],[2,o.q],[2,o.i],_.c,[8,null]],{placeholder:[0,"placeholder"],type:[1,"type"]},null),e._4(73,16384,null,0,o.o,[o.n],null,null),e._22(2048,[[15,4]],r.c,null,[s.a]),(l()(),e._26(-1,1,["\n    "])),(l()(),e._0(16777216,null,5,1,null,q)),e._4(77,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),(l()(),e._26(-1,1,["\n    "])),(l()(),e._0(16777216,null,5,2,null,T)),e._4(80,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),e._19(131072,i.b,[e.h]),(l()(),e._26(-1,1,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(84,0,null,null,64,"div",[["formGroupName","department"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,null,null)),e._4(85,212992,null,0,o.j,[[3,o.c],[8,null],[8,null]],{name:[0,"name"]},null),e._22(2048,null,o.c,null,[o.j]),e._4(87,16384,null,0,o.p,[o.c],null,null),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(89,0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),e._26(-1,null,["Sub group form"])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(92,0,null,null,22,"mat-form-field",[["class","full-width mat-input-container mat-form-field"]],[[2,"mat-input-invalid",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-focused",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,d.b,d.a)),e._4(93,7389184,null,7,r.b,[e.k,e.h,[2,_.e]],null,null),e._24(335544320,22,{_control:0}),e._24(335544320,23,{_placeholderChild:0}),e._24(335544320,24,{_labelChild:0}),e._24(603979776,25,{_errorChildren:1}),e._24(603979776,26,{_hintChildren:1}),e._24(603979776,27,{_prefixChildren:1}),e._24(603979776,28,{_suffixChildren:1}),(l()(),e._26(-1,1,["\n      "])),(l()(),e._5(102,0,null,1,7,"input",[["class","mat-input-element mat-form-field-autofill-control"],["formControlName","name"],["matInput",""]],[[2,"mat-input-server",null],[1,"id",0],[8,"placeholder",0],[8,"disabled",0],[8,"required",0],[8,"readOnly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,u){var t=!0;return"input"===n&&(t=!1!==e._16(l,103)._handleInput(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,103).onTouched()&&t),"compositionstart"===n&&(t=!1!==e._16(l,103)._compositionStart()&&t),"compositionend"===n&&(t=!1!==e._16(l,103)._compositionEnd(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,107)._focusChanged(!1)&&t),"focus"===n&&(t=!1!==e._16(l,107)._focusChanged(!0)&&t),"input"===n&&(t=!1!==e._16(l,107)._onInput()&&t),t},null,null)),e._4(103,16384,null,0,o.d,[e.C,e.k,[2,o.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[o.d]),e._4(105,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(107,933888,null,0,s.a,[e.k,c.a,[2,o.n],[2,o.q],[2,o.i],_.c,[8,null]],{placeholder:[0,"placeholder"]},null),e._4(108,16384,null,0,o.o,[o.n],null,null),e._22(2048,[[22,4]],r.c,null,[s.a]),(l()(),e._26(-1,1,["\n      "])),(l()(),e._0(16777216,null,5,2,null,V)),e._4(112,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),e._19(131072,i.b,[e.h]),(l()(),e._26(-1,1,["\n    "])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(116,0,null,null,31,"div",[["formGroupName","company"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,null,null)),e._4(117,212992,null,0,o.j,[[3,o.c],[8,null],[8,null]],{name:[0,"name"]},null),e._22(2048,null,o.c,null,[o.j]),e._4(119,16384,null,0,o.p,[o.c],null,null),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(121,0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),e._26(-1,null,["Sub sub group form"])),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(124,0,null,null,22,"mat-form-field",[["class","full-width mat-input-container mat-form-field"]],[[2,"mat-input-invalid",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-focused",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,d.b,d.a)),e._4(125,7389184,null,7,r.b,[e.k,e.h,[2,_.e]],null,null),e._24(335544320,29,{_control:0}),e._24(335544320,30,{_placeholderChild:0}),e._24(335544320,31,{_labelChild:0}),e._24(603979776,32,{_errorChildren:1}),e._24(603979776,33,{_hintChildren:1}),e._24(603979776,34,{_prefixChildren:1}),e._24(603979776,35,{_suffixChildren:1}),(l()(),e._26(-1,1,["\n        "])),(l()(),e._5(134,0,null,1,7,"input",[["class","mat-input-element mat-form-field-autofill-control"],["formControlName","name"],["matInput",""]],[[2,"mat-input-server",null],[1,"id",0],[8,"placeholder",0],[8,"disabled",0],[8,"required",0],[8,"readOnly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,u){var t=!0;return"input"===n&&(t=!1!==e._16(l,135)._handleInput(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,135).onTouched()&&t),"compositionstart"===n&&(t=!1!==e._16(l,135)._compositionStart()&&t),"compositionend"===n&&(t=!1!==e._16(l,135)._compositionEnd(u.target.value)&&t),"blur"===n&&(t=!1!==e._16(l,139)._focusChanged(!1)&&t),"focus"===n&&(t=!1!==e._16(l,139)._focusChanged(!0)&&t),"input"===n&&(t=!1!==e._16(l,139)._onInput()&&t),t},null,null)),e._4(135,16384,null,0,o.d,[e.C,e.k,[2,o.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[o.d]),e._4(137,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(139,933888,null,0,s.a,[e.k,c.a,[2,o.n],[2,o.q],[2,o.i],_.c,[8,null]],{placeholder:[0,"placeholder"]},null),e._4(140,16384,null,0,o.o,[o.n],null,null),e._22(2048,[[29,4]],r.c,null,[s.a]),(l()(),e._26(-1,1,["\n        "])),(l()(),e._0(16777216,null,5,2,null,D)),e._4(144,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),e._19(131072,i.b,[e.h]),(l()(),e._26(-1,1,["\n      "])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(150,0,null,null,17,"div",[["class","full-width"]],null,null,null,null,null)),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(152,0,null,null,6,"mat-checkbox",[["class","mat-checkbox"],["formControlName","isSuperuser"]],[[8,"id",0],[2,"mat-checkbox-indeterminate",null],[2,"mat-checkbox-checked",null],[2,"mat-checkbox-disabled",null],[2,"mat-checkbox-label-before",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,m.b,m.a)),e._4(153,4374528,null,0,f.b,[e.k,e.h,g.g,[8,null],[2,f.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[f.b]),e._4(155,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(157,16384,null,0,o.o,[o.n],null,null),(l()(),e._26(158,0,["",""])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(160,0,null,null,6,"mat-checkbox",[["class","mat-checkbox"],["formControlName","isStaff"]],[[8,"id",0],[2,"mat-checkbox-indeterminate",null],[2,"mat-checkbox-checked",null],[2,"mat-checkbox-disabled",null],[2,"mat-checkbox-label-before",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,m.b,m.a)),e._4(161,4374528,null,0,f.b,[e.k,e.h,g.g,[8,null],[2,f.a]],null,null),e._22(1024,null,o.m,function(l){return[l]},[f.b]),e._4(163,671744,null,0,o.g,[[3,o.c],[8,null],[8,null],[2,o.m]],{name:[0,"name"]},null),e._22(2048,null,o.n,null,[o.g]),e._4(165,16384,null,0,o.o,[o.n],null,null),(l()(),e._26(166,0,["",""])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(169,0,null,null,11,"div",[["class","full-width"]],null,null,null,null,null)),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(171,0,null,null,2,"p",[],null,null,null,null,null)),(l()(),e._26(172,null,["Form status: ",""])),e._19(0,i.f,[]),(l()(),e._26(-1,null,["\n    "])),(l()(),e._0(16777216,null,null,1,null,A)),e._4(176,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),(l()(),e._26(-1,null,["\n    "])),(l()(),e._0(16777216,null,null,1,null,N)),e._4(179,16384,null,0,i.l,[e.O,e.L],{ngIf:[0,"ngIf"]},null),(l()(),e._26(-1,null,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(182,0,null,null,35,"div",[["class","full-width"],["fxLayout.gt-md","row"],["fxLayout.lt-md","column"],["fxLayoutAlign","space-evenly stretch"]],null,null,null,null,null)),e._4(183,737280,null,0,h.g,[h.i,e.k,h.p],{layoutGtMd:[0,"layoutGtMd"],layoutLtMd:[1,"layoutLtMd"]},null),e._4(184,737280,null,0,h.f,[h.i,e.k,[2,h.g],h.p],{align:[0,"align"]},null),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(186,0,null,null,16,"div",[["fxFlex.gt-sm","50"],["fxFlex.lt-sm","100"],["fxLayout","row"],["fxLayoutAlign","start center"]],null,null,null,null,null)),e._4(187,737280,null,0,h.g,[h.i,e.k,h.p],{layout:[0,"layout"]},null),e._4(188,737280,null,0,h.f,[h.i,e.k,[2,h.g],h.p],{align:[0,"align"]},null),e._4(189,737280,null,0,h.d,[h.i,e.k,[3,h.g],h.p],{flexGtSm:[0,"flexGtSm"],flexLtSm:[1,"flexLtSm"]},null),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(191,0,null,null,2,"button",[["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.onLoadClick()&&e),e},p.d,p.b)),e._4(192,180224,null,0,b.b,[e.k,c.a,g.g],null,null),(l()(),e._26(-1,0,["Load"])),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(195,0,null,null,2,"button",[["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.onClearClick()&&e),e},p.d,p.b)),e._4(196,180224,null,0,b.b,[e.k,c.a,g.g],null,null),(l()(),e._26(-1,0,["Clear"])),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(199,0,null,null,2,"button",[["cdkFocusInitial",""],["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.onSaveClick()&&e),e},p.d,p.b)),e._4(200,180224,null,0,b.b,[e.k,c.a,g.g],{disabled:[0,"disabled"]},null),(l()(),e._26(-1,0,["Save"])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(204,0,null,null,12,"div",[["fxFlex.gt-sm","50"],["fxFlex.lt-sm","100"],["fxLayout","row"],["fxLayoutAlign","end center"]],null,null,null,null,null)),e._4(205,737280,null,0,h.g,[h.i,e.k,h.p],{layout:[0,"layout"]},null),e._4(206,737280,null,0,h.f,[h.i,e.k,[2,h.g],h.p],{align:[0,"align"]},null),e._4(207,737280,null,0,h.d,[h.i,e.k,[3,h.g],h.p],{flexGtSm:[0,"flexGtSm"],flexLtSm:[1,"flexLtSm"]},null),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(209,0,null,null,2,"button",[["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.onLoadExternalClick()&&e),e},p.d,p.b)),e._4(210,180224,null,0,b.b,[e.k,c.a,g.g],null,null),(l()(),e._26(-1,0,["Load external"])),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(213,0,null,null,2,"button",[["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.onClearExternalClick()&&e),e},p.d,p.b)),e._4(214,180224,null,0,b.b,[e.k,c.a,g.g],null,null),(l()(),e._26(-1,0,["Clear external"])),(l()(),e._26(-1,null,["\n    "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._26(-1,null,["\n"]))],function(l,n){var u,t,a,r,i,o=n.component;l(n,2,0,o.form),l(n,22,0,"username"),l(n,24,0,o.strings.username),l(n,29,0,null==(u=e._27(n,29,0,e._16(n,30).transform(null==o.form?null:o.form.customValidateErrors)))?null:null==u.username?null:u.username.length),l(n,46,0,"email"),l(n,48,0,o.strings.email,"email"),l(n,53,0,null==(t=e._27(n,53,0,e._16(n,54).transform(null==o.form?null:o.form.customValidateErrors)))?null:null==t.email?null:t.email.length),l(n,70,0,"dateOfBirth"),l(n,72,0,o.strings.dateOfBirth,"date"),l(n,77,0,o.form.get("dateOfBirth").hasError("required")),l(n,80,0,null==(a=e._27(n,80,0,e._16(n,81).transform(null==o.form?null:o.form.customValidateErrors)))?null:null==a.dateOfBirth?null:a.dateOfBirth.length),l(n,85,0,"department"),l(n,105,0,"name"),l(n,107,0,o.strings.department),l(n,112,0,null==(r=e._27(n,112,0,e._16(n,113).transform(null==o.form?null:o.form.customValidateErrors)))?null:null==r.department?null:null==r.department.name?null:r.department.name.length),l(n,117,0,"company"),l(n,137,0,"name"),l(n,139,0,o.departmentStrings.company),l(n,144,0,null==(i=e._27(n,144,0,e._16(n,145).transform(null==o.form?null:o.form.customValidateErrors)))?null:null==i.department?null:null==i.department.company?null:null==i.department.company.name?null:i.department.company.name.length),l(n,155,0,"isSuperuser"),l(n,163,0,"isStaff"),l(n,176,0,!o.form.valid),l(n,179,0,o.savedItem),l(n,183,0,"row","column"),l(n,184,0,"space-evenly stretch"),l(n,187,0,"row"),l(n,188,0,"start center"),l(n,189,0,"50","100"),l(n,200,0,!o.form.valid),l(n,205,0,"row"),l(n,206,0,"end center"),l(n,207,0,"50","100")},function(l,n){var u=n.component;l(n,0,0,e._16(n,4).ngClassUntouched,e._16(n,4).ngClassTouched,e._16(n,4).ngClassPristine,e._16(n,4).ngClassDirty,e._16(n,4).ngClassValid,e._16(n,4).ngClassInvalid,e._16(n,4).ngClassPending),l(n,9,1,[e._16(n,10)._control.errorState,e._16(n,10)._control.errorState,e._16(n,10)._canLabelFloat,e._16(n,10)._shouldLabelFloat(),e._16(n,10)._hideControlPlaceholder(),e._16(n,10)._control.disabled,e._16(n,10)._control.focused,e._16(n,10)._shouldForward("untouched"),e._16(n,10)._shouldForward("touched"),e._16(n,10)._shouldForward("pristine"),e._16(n,10)._shouldForward("dirty"),e._16(n,10)._shouldForward("valid"),e._16(n,10)._shouldForward("invalid"),e._16(n,10)._shouldForward("pending")]),l(n,19,1,[e._16(n,24)._isServer,e._16(n,24).id,e._16(n,24).placeholder,e._16(n,24).disabled,e._16(n,24).required,e._16(n,24).readonly,e._16(n,24)._ariaDescribedby||null,e._16(n,24).errorState,e._16(n,24).required.toString(),e._16(n,25).ngClassUntouched,e._16(n,25).ngClassTouched,e._16(n,25).ngClassPristine,e._16(n,25).ngClassDirty,e._16(n,25).ngClassValid,e._16(n,25).ngClassInvalid,e._16(n,25).ngClassPending]),l(n,33,1,[e._16(n,34)._control.errorState,e._16(n,34)._control.errorState,e._16(n,34)._canLabelFloat,e._16(n,34)._shouldLabelFloat(),e._16(n,34)._hideControlPlaceholder(),e._16(n,34)._control.disabled,e._16(n,34)._control.focused,e._16(n,34)._shouldForward("untouched"),e._16(n,34)._shouldForward("touched"),e._16(n,34)._shouldForward("pristine"),e._16(n,34)._shouldForward("dirty"),e._16(n,34)._shouldForward("valid"),e._16(n,34)._shouldForward("invalid"),e._16(n,34)._shouldForward("pending")]),l(n,43,1,[e._16(n,48)._isServer,e._16(n,48).id,e._16(n,48).placeholder,e._16(n,48).disabled,e._16(n,48).required,e._16(n,48).readonly,e._16(n,48)._ariaDescribedby||null,e._16(n,48).errorState,e._16(n,48).required.toString(),e._16(n,49).ngClassUntouched,e._16(n,49).ngClassTouched,e._16(n,49).ngClassPristine,e._16(n,49).ngClassDirty,e._16(n,49).ngClassValid,e._16(n,49).ngClassInvalid,e._16(n,49).ngClassPending]),l(n,57,1,[e._16(n,58)._control.errorState,e._16(n,58)._control.errorState,e._16(n,58)._canLabelFloat,e._16(n,58)._shouldLabelFloat(),e._16(n,58)._hideControlPlaceholder(),e._16(n,58)._control.disabled,e._16(n,58)._control.focused,e._16(n,58)._shouldForward("untouched"),e._16(n,58)._shouldForward("touched"),e._16(n,58)._shouldForward("pristine"),e._16(n,58)._shouldForward("dirty"),e._16(n,58)._shouldForward("valid"),e._16(n,58)._shouldForward("invalid"),e._16(n,58)._shouldForward("pending")]),l(n,67,1,[e._16(n,72)._isServer,e._16(n,72).id,e._16(n,72).placeholder,e._16(n,72).disabled,e._16(n,72).required,e._16(n,72).readonly,e._16(n,72)._ariaDescribedby||null,e._16(n,72).errorState,e._16(n,72).required.toString(),e._16(n,73).ngClassUntouched,e._16(n,73).ngClassTouched,e._16(n,73).ngClassPristine,e._16(n,73).ngClassDirty,e._16(n,73).ngClassValid,e._16(n,73).ngClassInvalid,e._16(n,73).ngClassPending]),l(n,84,0,e._16(n,87).ngClassUntouched,e._16(n,87).ngClassTouched,e._16(n,87).ngClassPristine,e._16(n,87).ngClassDirty,e._16(n,87).ngClassValid,e._16(n,87).ngClassInvalid,e._16(n,87).ngClassPending),l(n,92,1,[e._16(n,93)._control.errorState,e._16(n,93)._control.errorState,e._16(n,93)._canLabelFloat,e._16(n,93)._shouldLabelFloat(),e._16(n,93)._hideControlPlaceholder(),e._16(n,93)._control.disabled,e._16(n,93)._control.focused,e._16(n,93)._shouldForward("untouched"),e._16(n,93)._shouldForward("touched"),e._16(n,93)._shouldForward("pristine"),e._16(n,93)._shouldForward("dirty"),e._16(n,93)._shouldForward("valid"),e._16(n,93)._shouldForward("invalid"),e._16(n,93)._shouldForward("pending")]),l(n,102,1,[e._16(n,107)._isServer,e._16(n,107).id,e._16(n,107).placeholder,e._16(n,107).disabled,e._16(n,107).required,e._16(n,107).readonly,e._16(n,107)._ariaDescribedby||null,e._16(n,107).errorState,e._16(n,107).required.toString(),e._16(n,108).ngClassUntouched,e._16(n,108).ngClassTouched,e._16(n,108).ngClassPristine,e._16(n,108).ngClassDirty,e._16(n,108).ngClassValid,e._16(n,108).ngClassInvalid,e._16(n,108).ngClassPending]),l(n,116,0,e._16(n,119).ngClassUntouched,e._16(n,119).ngClassTouched,e._16(n,119).ngClassPristine,e._16(n,119).ngClassDirty,e._16(n,119).ngClassValid,e._16(n,119).ngClassInvalid,e._16(n,119).ngClassPending),l(n,124,1,[e._16(n,125)._control.errorState,e._16(n,125)._control.errorState,e._16(n,125)._canLabelFloat,e._16(n,125)._shouldLabelFloat(),e._16(n,125)._hideControlPlaceholder(),e._16(n,125)._control.disabled,e._16(n,125)._control.focused,e._16(n,125)._shouldForward("untouched"),e._16(n,125)._shouldForward("touched"),e._16(n,125)._shouldForward("pristine"),e._16(n,125)._shouldForward("dirty"),e._16(n,125)._shouldForward("valid"),e._16(n,125)._shouldForward("invalid"),e._16(n,125)._shouldForward("pending")]),l(n,134,1,[e._16(n,139)._isServer,e._16(n,139).id,e._16(n,139).placeholder,e._16(n,139).disabled,e._16(n,139).required,e._16(n,139).readonly,e._16(n,139)._ariaDescribedby||null,e._16(n,139).errorState,e._16(n,139).required.toString(),e._16(n,140).ngClassUntouched,e._16(n,140).ngClassTouched,e._16(n,140).ngClassPristine,e._16(n,140).ngClassDirty,e._16(n,140).ngClassValid,e._16(n,140).ngClassInvalid,e._16(n,140).ngClassPending]),l(n,152,1,[e._16(n,153).id,e._16(n,153).indeterminate,e._16(n,153).checked,e._16(n,153).disabled,"before"==e._16(n,153).labelPosition,e._16(n,157).ngClassUntouched,e._16(n,157).ngClassTouched,e._16(n,157).ngClassPristine,e._16(n,157).ngClassDirty,e._16(n,157).ngClassValid,e._16(n,157).ngClassInvalid,e._16(n,157).ngClassPending]),l(n,158,0,u.strings.isSuperuser),l(n,160,1,[e._16(n,161).id,e._16(n,161).indeterminate,e._16(n,161).checked,e._16(n,161).disabled,"before"==e._16(n,161).labelPosition,e._16(n,165).ngClassUntouched,e._16(n,165).ngClassTouched,e._16(n,165).ngClassPristine,e._16(n,165).ngClassDirty,e._16(n,165).ngClassValid,e._16(n,165).ngClassInvalid,e._16(n,165).ngClassPending]),l(n,166,0,u.strings.isStaff),l(n,172,0,e._27(n,172,0,e._16(n,173).transform(u.form.status))),l(n,191,0,e._16(n,192).disabled||null),l(n,195,0,e._16(n,196).disabled||null),l(n,199,0,e._16(n,200).disabled||null),l(n,209,0,e._16(n,210).disabled||null),l(n,213,0,e._16(n,214).disabled||null)})}var G=e._1("user-panel",j,function(l){return e._28(0,[(l()(),e._5(0,0,null,null,1,"user-panel",[],null,null,null,B,L)),e._4(1,49152,null,0,j,[],null,null)],null,null)},{form:"form",item:"item",strings:"strings",departmentStrings:"departmentStrings",companyStrings:"companyStrings"},{},[]),M=u("7jwS"),U=u("yB+r"),H=u("Hsn2"),R=u("Qhsx"),X=u("elRW"),Y=u("UDkH"),W=e._3({encapsulation:2,styles:[],data:{}});function z(l){return e._28(0,[(l()(),e._5(0,0,null,null,18,"div",[["class","advanced-page"],["fxLayout.gt-md","row"],["fxLayout.lt-md","column"],["fxLayoutAlign","space-evenly stretch"]],null,null,null,null,null)),e._4(1,737280,null,0,h.g,[h.i,e.k,h.p],{layoutGtMd:[0,"layoutGtMd"],layoutLtMd:[1,"layoutLtMd"]},null),e._4(2,737280,null,0,h.f,[h.i,e.k,[2,h.g],h.p],{align:[0,"align"]},null),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(4,0,null,null,9,"ngx-docs-example",[["fxFlex.gt-sm","50"],["fxFlex.lt-sm","100"],["title","Advanced: user panel"]],null,null,null,U.b,U.a)),e._4(5,737280,null,0,h.d,[h.i,e.k,[3,h.g],h.p],{flexGtSm:[0,"flexGtSm"],flexLtSm:[1,"flexLtSm"]},null),e._4(6,49152,null,0,H.a,[e.k,[2,R.b]],{html:[0,"html"],launch:[1,"launch"],title:[2,"title"],ts:[3,"ts"]},null),(l()(),e._26(-1,null,["\n    "])),(l()(),e._5(8,0,null,0,4,"div",[["class","body"]],null,null,null,null,null)),(l()(),e._26(-1,null,["\n      "])),(l()(),e._5(10,0,null,null,1,"user-panel",[],null,null,null,B,L)),e._4(11,49152,null,0,j,[],null,null),(l()(),e._26(-1,null,["\n    "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._26(-1,null,["\n  "])),(l()(),e._5(15,0,null,null,2,"source-tabs",[["fxFlex.gt-sm","50"],["fxFlex.lt-sm","100"],["title","Other files"]],null,null,null,M.c,M.a)),e._4(16,737280,null,0,h.d,[h.i,e.k,[3,h.g],h.p],{flexGtSm:[0,"flexGtSm"],flexLtSm:[1,"flexLtSm"]},null),e._4(17,49152,null,0,X.a,[],{title:[0,"title"],files:[1,"files"]},null),(l()(),e._26(-1,null,["\n"]))],function(l,n){var u=n.component;l(n,1,0,"row","column"),l(n,2,0,"space-evenly stretch"),l(n,5,0,"50","100"),l(n,6,0,u.source.html,u.source.launch,"Advanced: user panel",u.source.ts),l(n,16,0,"50","100"),l(n,17,0,"Other files",u.otherFiles)},null)}var J=e._1("advanced-page",Y.a,function(l){return e._28(0,[(l()(),e._5(0,0,null,null,1,"advanced-page",[],null,null,null,z,W)),e._4(1,49152,null,0,Y.a,[],null,null)],null,null)},{},{},[]),Q=u("9Sd6"),Z=u("z7Rf"),K=u("ItHS"),$=u("OE0E"),ll=u("6sdf"),nl=u("1T37"),ul=u("+j5Y"),el=u("Mcof"),tl=u("7u3n"),al=u("O29X"),rl=u("bkcK"),il=u("6GVX"),ol=u("akaM"),dl=function(){function l(){}return l.forRoot=function(){return{ngModule:l,providers:[]}},l}(),_l=u("bfOx"),sl=u("b0JF");u.d(n,"AdvancedPageModuleNgFactory",function(){return cl});var cl=e._2(t,[],function(l){return e._12([e._13(512,e.j,e.Y,[[8,[a.a,G,M.b,J]],[3,e.j],e.w]),e._13(4608,i.n,i.m,[e.t,[2,i.x]]),e._13(5120,h.a,h.c,[]),e._13(4608,h.b,h.b,[h.a]),e._13(4608,h.h,h.h,[e.y,e.A,i.d]),e._13(4608,h.i,h.i,[h.b,h.h]),e._13(5120,h.l,h.k,[[3,h.l],h.h,h.b]),e._13(6144,h.r,null,[i.d]),e._13(4608,h.s,h.s,[[2,h.r]]),e._13(4608,h.n,h.n,[]),e._13(4608,h.p,h.p,[[2,h.n],[2,h.m],e.A]),e._13(5120,e.b,function(l,n){return[h.q(l,n)]},[i.d,e.A]),e._13(6144,Q.b,null,[i.d]),e._13(4608,Q.c,Q.c,[[2,Q.b]]),e._13(4608,c.a,c.a,[]),e._13(4608,g.i,g.i,[c.a]),e._13(4608,g.h,g.h,[g.i,e.y,i.d]),e._13(136192,g.d,g.b,[[3,g.d],i.d]),e._13(5120,g.l,g.k,[[3,g.l],[2,g.j],i.d]),e._13(5120,g.g,g.e,[[3,g.g],e.y,c.a]),e._13(5120,Z.d,Z.a,[[3,Z.d],[2,K.c],$.c,[2,i.d]]),e._13(4608,ll.b,ll.b,[]),e._13(5120,nl.c,nl.a,[[3,nl.c],e.y,c.a]),e._13(5120,nl.f,nl.e,[[3,nl.f],c.a,e.y]),e._13(4608,ul.g,ul.g,[nl.c,nl.f,e.y,i.d]),e._13(5120,ul.c,ul.h,[[3,ul.c],i.d]),e._13(4608,ul.f,ul.f,[nl.f,i.d]),e._13(5120,ul.d,ul.k,[[3,ul.d],i.d]),e._13(4608,ul.a,ul.a,[ul.g,ul.c,e.j,ul.f,ul.d,e.g,e.q,e.y,i.d]),e._13(5120,ul.i,ul.j,[ul.a]),e._13(4608,el.d,el.d,[c.a]),e._13(135680,el.a,el.a,[el.d,e.y]),e._13(5120,tl.b,tl.c,[ul.a]),e._13(4608,_.c,_.c,[]),e._13(4608,o.v,o.v,[]),e._13(4608,o.e,o.e,[]),e._13(512,i.c,i.c,[]),e._13(512,al.a,al.a,[]),e._13(512,h.j,h.j,[]),e._13(512,h.t,h.t,[]),e._13(512,h.e,h.e,[[2,h.m],e.A]),e._13(512,Q.a,Q.a,[]),e._13(256,_.d,!0,[]),e._13(512,_.g,_.g,[[2,_.d]]),e._13(512,c.b,c.b,[]),e._13(512,_.j,_.j,[]),e._13(512,g.a,g.a,[]),e._13(512,b.c,b.c,[]),e._13(512,Z.c,Z.c,[]),e._13(512,rl.g,rl.g,[]),e._13(512,ll.c,ll.c,[]),e._13(512,nl.b,nl.b,[]),e._13(512,il.i,il.i,[]),e._13(512,ul.e,ul.e,[]),e._13(512,el.c,el.c,[]),e._13(512,tl.e,tl.e,[]),e._13(512,ol.a,ol.a,[]),e._13(512,R.a,R.a,[]),e._13(512,r.d,r.d,[]),e._13(512,s.b,s.b,[]),e._13(512,f.c,f.c,[]),e._13(512,o.t,o.t,[]),e._13(512,o.k,o.k,[]),e._13(512,o.r,o.r,[]),e._13(512,dl,dl,[]),e._13(512,_l.m,_l.m,[[2,_l.r],[2,_l.k]]),e._13(512,sl.a,sl.a,[]),e._13(512,t,t,[]),e._13(256,tl.a,{showDelay:0,hideDelay:0,touchendHideDelay:1500},[]),e._13(256,R.b,void 0,[]),e._13(1024,_l.i,function(){return[[{path:"",component:Y.a,data:{name:"advanced",title:"Advanced",visible:!0},children:[]}]]},[])])})}});