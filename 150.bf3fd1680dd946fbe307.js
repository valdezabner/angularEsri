(window.webpackJsonp=window.webpackJsonp||[]).push([[150],{Glky:function(e,t,i){"use strict";i.r(t);var s=i("HaE+"),n=i("zlDU"),r=i("f4Nx"),a=i("qatw"),l=i("wdpY"),d=i("Z4F+"),u=i("ZlUD"),o=i("gLc9"),c=i("p0UO"),p=i("iNG6"),f=i("HsO1"),y=i("ZRfE"),b=i("ZBG3"),m=i("IcpP");const h=r.a,g={xmin:-180,ymin:-90,xmax:180,ymax:90,spatialReference:r.a},j={hasAttachments:!1,capabilities:"query, editing, create, delete, update",useStandardizedQueries:!0,supportsCoordinatesQuantization:!0,supportsReturningQueryGeometry:!0,advancedQueryCapabilities:{supportsQueryAttachments:!1,supportsStatistics:!0,supportsPercentileStatistics:!0,supportsReturningGeometryCentroid:!0,supportsQueryWithDistance:!0,supportsDistinct:!0,supportsReturningQueryExtent:!0,supportsReturningGeometryProperties:!1,supportsHavingClause:!0,supportsOrderBy:!0,supportsPagination:!0,supportsQueryWithResultType:!1,supportsSqlExpression:!0,supportsDisjointSpatialRel:!0}};function I(e){return Object(a.f)(e)?null!=e.z:!!e.hasZ}function F(e){return Object(a.f)(e)?null!=e.m:!!e.hasM}t.default=class{constructor(){this._queryEngine=null,this._nextObjectId=null}destroy(){this._queryEngine&&this._queryEngine&&this._queryEngine.destroy(),this._queryEngine=this._requiredFields=this._fieldsIndex=this._createDefaultAttributes=null}load(e){var t=this;return Object(s.a)(function*(){const i=[],{features:s}=e,r=t._inferLayerProperties(s,e.fields),a=e.fields||[],u=null!=e.hasM?e.hasM:r.hasM,m=null!=e.hasZ?e.hasZ:r.hasZ,I=!e.spatialReference&&!r.spatialReference,F=I?h:e.spatialReference||r.spatialReference,O=I?g:null,_=e.geometryType||r.geometryType;let E=e.objectIdField||r.objectIdField,q=e.timeInfo;if(_&&(I&&i.push({name:"feature-layer:spatial-reference-not-found",message:"Spatial reference not provided or found in features. Defaults to WGS84"}),!_))throw new n.a("feature-layer:missing-property","geometryType not set and couldn't be inferred from the provided features");if(!E)throw new n.a("feature-layer:missing-property","objectIdField not set and couldn't be found in the provided fields");if(r.objectIdField&&E!==r.objectIdField&&(i.push({name:"feature-layer:duplicated-oid-field",message:`Provided objectIdField "${E}" doesn't match the field name "${r.objectIdField}", found in the provided fields`}),E=r.objectIdField),E&&!r.objectIdField){let e=null;a.some(t=>t.name===E&&(e=t,!0))?(e.type="esriFieldTypeOID",e.editable=!1,e.nullable=!1):a.unshift({alias:E,name:E,type:"esriFieldTypeOID",editable:!1,nullable:!1})}for(const e of a){if(null==e.name&&(e.name=e.alias),null==e.alias&&(e.alias=e.name),!e.name)throw new n.a("feature-layer:invalid-field-name","field name is missing",{field:e});if(e.name===E&&(e.type="esriFieldTypeOID"),-1===d.a.jsonValues.indexOf(e.type))throw new n.a("feature-layer:invalid-field-type",`invalid type for field "${e.name}"`,{field:e})}const x={};t._requiredFields=[];for(const e of a)if("esriFieldTypeOID"!==e.type&&"esriFieldTypeGlobalID"!==e.type){e.editable=null==e.editable||!!e.editable,e.nullable=null==e.nullable||!!e.nullable;const i=Object(l.o)(e);e.nullable||void 0!==i?x[e.name]=i:t._requiredFields.push(e)}if(t._fieldsIndex=new o.a(a),t._createDefaultAttributes=Object(p.a)(x,E),q){if(q.startTimeField){const e=t._fieldsIndex.get(q.startTimeField);e?(q.startTimeField=e.name,e.type="esriFieldTypeDate"):q.startTimeField=null}if(q.endTimeField){const e=t._fieldsIndex.get(q.endTimeField);e?(q.endTimeField=e.name,e.type="esriFieldTypeDate"):q.endTimeField=null}if(q.trackIdField){const e=t._fieldsIndex.get(q.trackIdField);e?q.trackIdField=e.name:(q.trackIdField=null,i.push({name:"feature-layer:invalid-timeInfo-trackIdField",message:"trackIdField is missing",details:{timeInfo:q}}))}q.startTimeField||q.endTimeField||(i.push({name:"feature-layer:invalid-timeInfo",message:"startTimeField and endTimeField are missing or invalid",details:{timeInfo:q}}),q=null)}const T={warnings:i,featureErrors:[],layerDefinition:{...j,drawingInfo:Object(p.c)(_),templates:Object(p.b)(x),extent:O,geometryType:_,objectIdField:E,fields:a,hasZ:!!m,hasM:!!u,timeInfo:q},assignedObjectIds:{}};if(t._queryEngine=new b.a({fields:a,geometryType:_,hasM:u,hasZ:m,objectIdField:E,spatialReference:F,featureStore:new y.a({geometryType:_,hasM:u,hasZ:m}),timeInfo:q,cacheSpatialQueries:!0}),!s||!s.length)return t._nextObjectId=c.b,T;const R=Object(c.a)(E,s);return t._nextObjectId=R+1,yield Object(f.a)(s,F),t._loadInitialFeatures(T,s)})()}applyEdits(e){var t=this;return Object(s.a)(function*(){const{spatialReference:i,geometryType:s}=t._queryEngine;return yield Promise.all([Object(m.c)(i,s),Object(f.a)(e.adds,i),Object(f.a)(e.updates,i)]),t._applyEdits(e)})()}queryFeatures(e,t={}){return this._queryEngine.executeQuery(e,t.signal)}queryFeatureCount(e,t={}){return this._queryEngine.executeQueryForCount(e,t.signal)}queryObjectIds(e,t={}){return this._queryEngine.executeQueryForIds(e,t.signal)}queryExtent(e,t={}){return this._queryEngine.executeQueryForExtent(e,t.signal)}querySnapping(e,t={}){return this._queryEngine.executeQueryForSnapping(e,t.signal)}_inferLayerProperties(e,t){let i,s,n=null,r=null,l=null;for(const d of e){const e=d.geometry;if(e&&(n||(n=Object(a.c)(e)),r||(r=e.spatialReference),null==i&&(i=I(e)),null==s&&(s=F(e)),n&&r&&null!=i&&null!=s))break}if(t&&t.length){let e=null;t.some(t=>{const i="esriFieldTypeOID"===t.type,s=!t.type&&t.name&&"objectid"===t.name.toLowerCase();return e=t,i||s})&&(l=e.name)}return{geometryType:n,spatialReference:r,objectIdField:l,hasM:s,hasZ:i}}_loadInitialFeatures(e,t){const{geometryType:i,hasM:s,hasZ:n,objectIdField:r,spatialReference:l,featureStore:d}=this._queryEngine,o=[];for(const u of t){if(null!=u.uid&&(e.assignedObjectIds[u.uid]=-1),u.geometry&&i!==Object(a.c)(u.geometry)){e.featureErrors.push(Object(m.a)("Incorrect geometry type."));continue}const t=this._createDefaultAttributes(),s=Object(m.d)(this._fieldsIndex,this._requiredFields,t,u.attributes,!0,e.warnings);s?e.featureErrors.push(s):(this._assignObjectId(t,u.attributes,!0),u.attributes=t,null!=u.uid&&(e.assignedObjectIds[u.uid]=u.attributes[r]),u.geometry&&(u.geometry=Object(f.b)(u.geometry,u.geometry.spatialReference,l)),o.push(u))}if(d.addMany(Object(u.c)([],o,i,n,s,r)),e.layerDefinition.extent=this._queryEngine.fullExtent,e.layerDefinition.timeInfo){const{start:t,end:i}=this._queryEngine.timeExtent;e.layerDefinition.timeInfo.timeExtent=[t,i]}return e}_applyEdits(e){const{adds:t,updates:i,deletes:s}=e,n={addResults:[],deleteResults:[],updateResults:[],uidToObjectId:{}};if(t&&t.length&&this._applyAddEdits(n,t),i&&i.length&&this._applyUpdateEdits(n,i),s&&s.length){for(const e of s)n.deleteResults.push(Object(m.b)(e));this._queryEngine.featureStore.removeManyById(s)}return{fullExtent:this._queryEngine.fullExtent,featureEditResults:n}}_applyAddEdits(e,t){const{addResults:i}=e,{geometryType:s,hasM:n,hasZ:r,objectIdField:l,spatialReference:d,featureStore:o}=this._queryEngine,c=[];for(const u of t){if(u.geometry&&s!==Object(a.c)(u.geometry)){i.push(Object(m.a)("Incorrect geometry type."));continue}const t=this._createDefaultAttributes(),n=Object(m.d)(this._fieldsIndex,this._requiredFields,t,u.attributes);n?i.push(n):(this._assignObjectId(t,u.attributes),u.attributes=t,null!=u.uid&&(e.uidToObjectId[u.uid]=u.attributes[l]),u.geometry&&(u.geometry=Object(f.b)(Object(m.e)(u.geometry,d),u.geometry.spatialReference,d)),c.push(u),i.push(Object(m.b)(u.attributes[l])))}o.addMany(Object(u.c)([],c,s,r,n,l))}_applyUpdateEdits({updateResults:e},t){const{geometryType:i,hasM:s,hasZ:n,objectIdField:r,spatialReference:l,featureStore:d}=this._queryEngine;for(const o of t){const{attributes:t,geometry:c}=o,p=t&&t[r];if(null==p){e.push(Object(m.a)(`Identifier field ${r} missing`));continue}if(!d.has(p)){e.push(Object(m.a)(`Feature with object id ${p} missing`));continue}const y=Object(u.i)(d.getFeature(p),i,n,s);if(c){if(i!==Object(a.c)(c)){e.push(Object(m.a)("Incorrect geometry type."));continue}y.geometry=Object(f.b)(Object(m.e)(c,l),c.spatialReference,l)}if(t){const i=Object(m.d)(this._fieldsIndex,this._requiredFields,y.attributes,t);if(i){e.push(i);continue}}d.add(Object(u.a)(y,i,n,s,r)),e.push(Object(m.b)(p))}}_assignObjectId(e,t,i=!1){const s=this._queryEngine.objectIdField;e[s]=i&&t&&isFinite(t[s])?t[s]:this._nextObjectId++}}}}]);