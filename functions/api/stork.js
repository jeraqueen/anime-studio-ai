export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const api = "https://api.stork.ai/api/v1/talking-photo";
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return json({error:"Missing Stork API key. Save it in the Animate & lip-sync section."},401);
  try {
    let upstream;
    if (request.method === "POST") {
      const body = await request.json();
      if (!body.image_url || !/^https:\/\//i.test(body.image_url)) return json({error:"A public HTTPS character image URL is required."},400);
      if (!body.text || !body.voice_id) return json({error:"Dialogue text and voice are required."},400);
      if (body.text.length > 650) return json({error:"Free-tier dialogue is limited to 650 characters. Shorten the script."},400);
      const payload = {image_url:body.image_url,text:body.text,voice_id:body.voice_id,aspect_ratio:body.aspect_ratio||"9:16",tier:"free"};
      upstream = await fetch(api,{method:"POST",headers:{Authorization:auth,"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},body:JSON.stringify(payload)});
    } else if (request.method === "GET") {
      const id = url.searchParams.get("id");
      if (!id) return json({error:"Missing job id."},400);
      upstream = await fetch(api+"?id="+encodeURIComponent(id),{headers:{Authorization:auth}});
    } else return json({error:"Method not allowed."},405);
    const text = await upstream.text();
    return new Response(text,{status:upstream.status,headers:{"Content-Type":upstream.headers.get("content-type")||"application/json","Cache-Control":"no-store"}});
  } catch (e) { return json({error:e.message||"Stork request failed."},502); }
}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});}
