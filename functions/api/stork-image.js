export async function onRequest(context) {
  const {request}=context;
  if(request.method!=="POST") return json({error:"POST a character image file."},405);
  try {
    const incoming=await request.formData();
    const file=incoming.get("file");
    if(!file || typeof file.arrayBuffer!=="function") return json({error:"Choose a character image."},400);
    if(file.size>12*1024*1024) return json({error:"Image must be 12 MB or smaller."},413);
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)) return json({error:"Use a JPG, PNG, or WebP image."},400);
    const form=new FormData();
    form.append("reqtype","fileupload");
    form.append("fileToUpload",file,file.name||"character-image");
    const res=await fetch("https://catbox.moe/user/api.php",{method:"POST",body:form});
    const result=(await res.text()).trim();
    if(!res.ok || !/^https:\/\/files\.catbox\.moe\//.test(result)) return json({error:"Image hosting failed: "+result.slice(0,300)},502);
    return json({image_url:result,notice:"Image uploaded to public third-party hosting for video generation."});
  } catch(e){return json({error:e.message||"Image upload failed."},502);}
}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});}
