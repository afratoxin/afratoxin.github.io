export function syncStudyFolder(view,doc=document){
  const units=[['immune','immuneUnitTab'],['anticancer','anticancerUnitTab'],['signal','signalUnitTab'],['checkpoint32','checkpoint32UnitTab']];
  const active=units.some(([name])=>name===view);
  doc.getElementById('oncoView').hidden=!active;
  for(const [name,id] of units){doc.getElementById(name+'View').hidden=name!==view;const tab=doc.getElementById(id);tab.classList.toggle('active',name===view);tab.setAttribute('aria-selected',String(name===view));}
  return active;
}
