// Display-only changes also apply to snapshots saved before the name cleanup.
const names=[['Filgrastim (rhG-CSF)','Filgrastim'],['Sargramostim (rhGM-CSF)','Sargramostim'],['Etanercept (Enbrel)','Etanercept'],['Infliximab (Remicade)','Infliximab'],['Adalimumab (Humira)','Adalimumab'],['Alefacept (LFA-3-Ig)','Alefacept'],['Abatacept (CTLA-4-Ig)','Abatacept']];
export function cleanStudyDrugLabels(value){
 if(typeof value==='string')return names.reduce((text,[old,name])=>text.split(old).join(name),value);
 if(Array.isArray(value))return value.map(cleanStudyDrugLabels);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,cleanStudyDrugLabels(v)]));
 return value;
}
