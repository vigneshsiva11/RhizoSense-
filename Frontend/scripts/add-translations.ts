import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANS_DIR = path.resolve(__dirname, "../src/lib/i18n/translations");

const newEn = {
  // common
  next: "Next",
  previous: "Previous",
  more: "More",
  retry: "Retry",

  // onboarding
  "onboarding.farmer_name": "Farmer Name *",
  "onboarding.location": "Location *",
  "onboarding.crop_type": "Crop Type *",
  "onboarding.farm_area": "Farm Area (acres) *",
  "onboarding.upload_title": "Upload Soil Sample Image",
  "onboarding.upload_desc":
    "In production, this triggers lab sequencing. For this demo, we simulate the analysis.",
  "onboarding.preview_alt": "Soil sample preview",
  "onboarding.drop_image": "Drop soil image here or click to browse",
  "onboarding.sample_info":
    "Your sample will be analysed using 16S rRNA metagenomic sequencing pipeline",
  "onboarding.start_analysis": "Start Analysis",
  "onboarding.analyzing": "Analysing Your Soil Sample…",
  "onboarding.analysis_complete": "Analysis Complete!",
  "onboarding.view_results": "View Results",
  "onboarding.deficiencies_detected": "Deficiencies Detected",
  "onboarding.top_recommendation": "Top Recommendation",
  "onboarding.total_cost": "total cost",
  "onboarding.estimated_saving": "estimated saving vs chemical fertilizer",
  "onboarding.view_dashboard": "View Full Dashboard",
  "onboarding.back_home": "Back to Home",
  "onboarding.add_new_farm": "Add New Farm",
  "onboarding.add_new_farm_desc": "Onboarding wizard to add a new farm with soil analysis",
  "onboarding.ph_farmer_name": "Enter farmer name",
  "onboarding.ph_location": "e.g. Coimbatore, Tamil Nadu",
  "onboarding.ph_crop": "Select crop type",
  "onboarding.ph_area": "e.g. 3",
  "onboarding.step_1": "Preprocessing soil image...",
  "onboarding.step_2": "Simulating 16S rRNA sequencing...",
  "onboarding.step_3": "Running Kraken2 taxonomic classification...",
  "onboarding.step_4": "Applying FAPROTAX functional annotation...",
  "onboarding.step_5": "Computing health score with Random Forest model...",
  "onboarding.step_6": "Generating biofertilizer recommendations...",
  "onboarding.label_1": "Farm Details",
  "onboarding.label_2": "Soil Sample",
  "onboarding.label_3": "Processing",
  "onboarding.label_4": "Results",

  // Recommendations.tsx
  "recommendations.per_acre": "/acre · ₹",
  "recommendations.total": "total",

  // ScoreFactors.tsx
  "score_factors.powered_by":
    "Powered by SHAP explainability — shows which microbial factors raised or lowered your score vs an average farm.",

  // ui
  "ui.breadcrumb": "breadcrumb",
  "ui.previous_slide": "Previous slide",
  "ui.next_slide": "Next slide",
  "ui.pagination": "pagination",
  "ui.go_previous": "Go to previous page",
  "ui.go_next": "Go to next page",
  "ui.more_pages": "More pages",
  "ui.sidebar": "Sidebar",
  "ui.sidebar_desc": "Displays the mobile sidebar.",
  "ui.toggle_sidebar": "Toggle Sidebar",

  // routes
  "farm.showing_demo": "Showing demo data — backend at",
  "farm.unreachable": "is currently unreachable.",
  "farm.acres": "acres",
  "index.rhizosense": "RhizoSense",
  "index.farm_portfolio": "Farm Portfolio",
  "index.add_new": "＋ Add New Farm",

  // root
  "root.not_found": "Page not found",
  "root.not_found_desc": "The page you're looking for doesn't exist or has been moved.",
  "root.go_home": "Go home",
  "root.error": "This page didn't load",
  "root.error_desc": "Something went wrong on our end. You can try refreshing or head back home.",
  "root.try_again": "Try again",
};

const newTa = {
  next: "அடுத்து",
  previous: "முந்தைய",
  more: "மேலும்",
  retry: "மீண்டும் முயற்சி செய்",

  "onboarding.farmer_name": "விவசாயி பெயர் *",
  "onboarding.location": "இடம் *",
  "onboarding.crop_type": "பயிர் வகை *",
  "onboarding.farm_area": "பண்ணை பரப்பளவு (ஏக்கர்) *",
  "onboarding.upload_title": "மண் மாதிரி படத்தை பதிவேற்றவும்",
  "onboarding.upload_desc":
    "உற்பத்தியில், இது ஆய்வக வரிசைமுறையைத் தூண்டுகிறது. இந்த டெமோவிற்கு, பகுப்பாய்வை உருவகப்படுத்துகிறோம்.",
  "onboarding.preview_alt": "மண் மாதிரி முன்னோட்டம்",
  "onboarding.drop_image": "மண் படத்தை இங்கே விடவும் அல்லது உலாவ கிளிக் செய்யவும்",
  "onboarding.sample_info":
    "உங்கள் மாதிரி 16S rRNA மெட்டாஜெனோமிக் வரிசைமுறை குழாயைப் பயன்படுத்தி பகுப்பாய்வு செய்யப்படும்",
  "onboarding.start_analysis": "பகுப்பாய்வைத் தொடங்கு",
  "onboarding.analyzing": "உங்கள் மண் மாதிரியைப் பகுப்பாய்வு செய்கிறது…",
  "onboarding.analysis_complete": "பகுப்பாய்வு முடிந்தது!",
  "onboarding.view_results": "முடிவுகளைக் காண்க",
  "onboarding.deficiencies_detected": "குறைபாடுகள் கண்டறியப்பட்டன",
  "onboarding.top_recommendation": "சிறந்த பரிந்துரை",
  "onboarding.total_cost": "மொத்த செலவு",
  "onboarding.estimated_saving": "இரசாயன உரத்திற்கு எதிரான மதிப்பிடப்பட்ட சேமிப்பு",
  "onboarding.view_dashboard": "முழு டாஷ்போர்டைக் காண்க",
  "onboarding.back_home": "முகப்புக்குத் திரும்பு",
  "onboarding.add_new_farm": "புதிய பண்ணையைச் சேர்",
  "onboarding.add_new_farm_desc": "மண் பகுப்பாய்வுடன் புதிய பண்ணையைச் சேர்க்க வழிகாட்டி",
  "onboarding.ph_farmer_name": "விவசாயி பெயரை உள்ளிடவும்",
  "onboarding.ph_location": "உதாரணமாக கோயம்புத்தூர், தமிழ்நாடு",
  "onboarding.ph_crop": "பயிர் வகையைத் தேர்ந்தெடுக்கவும்",
  "onboarding.ph_area": "உதாரணமாக 3",
  "onboarding.step_1": "மண் படத்தை செயலாக்குகிறது...",
  "onboarding.step_2": "16S rRNA வரிசைமுறையை உருவகப்படுத்துகிறது...",
  "onboarding.step_3": "Kraken2 வகைப்பாட்டை இயக்குகிறது...",
  "onboarding.step_4": "FAPROTAX செயல்பாட்டு குறிப்பைப் பயன்படுத்துகிறது...",
  "onboarding.step_5": "Random Forest மாதிரியுடன் ஆரோக்கிய மதிப்பெண்ணைக் கணக்கிடுகிறது...",
  "onboarding.step_6": "உயிர் உரப் பரிந்துரைகளை உருவாக்குகிறது...",
  "onboarding.label_1": "பண்ணை விவரங்கள்",
  "onboarding.label_2": "மண் மாதிரி",
  "onboarding.label_3": "செயலாக்கம்",
  "onboarding.label_4": "முடிவுகள்",

  "recommendations.per_acre": "/ஏக்கர் · ₹",
  "recommendations.total": "மொத்தம்",

  "score_factors.powered_by":
    "SHAP மூலம் இயக்கப்படுகிறது — சராசரி பண்ணையுடன் ஒப்பிடும்போது உங்கள் மதிப்பெண்ணை உயர்த்திய அல்லது குறைத்த நுண்ணுயிர் காரணிகளைக் காட்டுகிறது.",

  "ui.breadcrumb": "பாதை",
  "ui.previous_slide": "முந்தைய ஸ்லைடு",
  "ui.next_slide": "அடுத்த ஸ்லைடு",
  "ui.pagination": "பக்க எண்",
  "ui.go_previous": "முந்தைய பக்கத்திற்குச் செல்",
  "ui.go_next": "அடுத்த பக்கத்திற்குச் செல்",
  "ui.more_pages": "மேலும் பக்கங்கள்",
  "ui.sidebar": "பக்கப்பட்டி",
  "ui.sidebar_desc": "மொபைல் பக்கப்பட்டியைக் காட்டுகிறது.",
  "ui.toggle_sidebar": "பக்கப்பட்டியை நிலைமாற்று",

  "farm.showing_demo": "டெமோ தரவைக் காட்டுகிறது — பின்தளம்",
  "farm.unreachable": "தற்போது அணுக முடியவில்லை.",
  "farm.acres": "ஏக்கர்",
  "index.rhizosense": "ரைசோசென்ஸ் (RhizoSense)",
  "index.farm_portfolio": "பண்ணை தொகுப்பு",
  "index.add_new": "＋ புதிய பண்ணையைச் சேர்",

  "root.not_found": "பக்கம் கிடைக்கவில்லை",
  "root.not_found_desc": "நீங்கள் தேடும் பக்கம் இல்லை அல்லது நகர்த்தப்பட்டுள்ளது.",
  "root.go_home": "முகப்புக்குச் செல்",
  "root.error": "இந்தப் பக்கம் ஏற்றப்படவில்லை",
  "root.error_desc":
    "எங்கள் பக்கத்தில் ஏதோ தவறு நடந்துவிட்டது. நீங்கள் புதுப்பிக்க முயற்சிக்கலாம் அல்லது முகப்புக்குத் திரும்பலாம்.",
  "root.try_again": "மீண்டும் முயற்சி செய்",
};

const newHi = {
  next: "अगला",
  previous: "पिछला",
  more: "अधिक",
  retry: "पुनः प्रयास करें",

  "onboarding.farmer_name": "किसान का नाम *",
  "onboarding.location": "स्थान *",
  "onboarding.crop_type": "फसल का प्रकार *",
  "onboarding.farm_area": "खेत का क्षेत्रफल (एकड़) *",
  "onboarding.upload_title": "मिट्टी के नमूने की छवि अपलोड करें",
  "onboarding.upload_desc":
    "उत्पादन में, यह लैब अनुक्रमण को ट्रिगर करता है। इस डेमो के लिए, हम विश्लेषण का अनुकरण करते हैं।",
  "onboarding.preview_alt": "मिट्टी के नमूने का पूर्वावलोकन",
  "onboarding.drop_image": "मिट्टी की छवि यहाँ छोड़ें या ब्राउज़ करने के लिए क्लिक करें",
  "onboarding.sample_info":
    "आपके नमूने का विश्लेषण 16S rRNA मेटाजीनोमिक अनुक्रमण पाइपलाइन का उपयोग करके किया जाएगा",
  "onboarding.start_analysis": "विश्लेषण शुरू करें",
  "onboarding.analyzing": "आपके मिट्टी के नमूने का विश्लेषण किया जा रहा है…",
  "onboarding.analysis_complete": "विश्लेषण पूरा हुआ!",
  "onboarding.view_results": "परिणाम देखें",
  "onboarding.deficiencies_detected": "कमियां पाई गईं",
  "onboarding.top_recommendation": "शीर्ष सिफारिश",
  "onboarding.total_cost": "कुल लागत",
  "onboarding.estimated_saving": "रासायनिक उर्वरक के मुकाबले अनुमानित बचत",
  "onboarding.view_dashboard": "पूरा डैशबोर्ड देखें",
  "onboarding.back_home": "होम पर वापस जाएं",
  "onboarding.add_new_farm": "नया खेत जोड़ें",
  "onboarding.add_new_farm_desc":
    "मिट्टी के विश्लेषण के साथ एक नया खेत जोड़ने के लिए ऑनबोर्डिंग विज़ार्ड",
  "onboarding.ph_farmer_name": "किसान का नाम दर्ज करें",
  "onboarding.ph_location": "उदाहरण: कोयंबटूर, तमिलनाडु",
  "onboarding.ph_crop": "फसल का प्रकार चुनें",
  "onboarding.ph_area": "उदाहरण: 3",
  "onboarding.step_1": "मिट्टी की छवि को प्रोसेस किया जा रहा है...",
  "onboarding.step_2": "16S rRNA अनुक्रमण का अनुकरण किया जा रहा है...",
  "onboarding.step_3": "Kraken2 वर्गीकरण चलाया जा रहा है...",
  "onboarding.step_4": "FAPROTAX कार्यात्मक एनोटेशन लागू किया जा रहा है...",
  "onboarding.step_5": "Random Forest मॉडल के साथ स्वास्थ्य स्कोर की गणना की जा रही है...",
  "onboarding.step_6": "जैव उर्वरक सिफारिशें उत्पन्न की जा रही हैं...",
  "onboarding.label_1": "खेत का विवरण",
  "onboarding.label_2": "मिट्टी का नमूना",
  "onboarding.label_3": "प्रोसेसिंग",
  "onboarding.label_4": "परिणाम",

  "recommendations.per_acre": "/एकड़ · ₹",
  "recommendations.total": "कुल",

  "score_factors.powered_by":
    "SHAP द्वारा संचालित — दिखाता है कि किन सूक्ष्मजीव कारकों ने औसत खेत की तुलना में आपके स्कोर को बढ़ाया या घटाया।",

  "ui.breadcrumb": "ब्रेडक्रंब",
  "ui.previous_slide": "पिछली स्लाइड",
  "ui.next_slide": "अगली स्लाइड",
  "ui.pagination": "पृष्ठांकन",
  "ui.go_previous": "पिछले पृष्ठ पर जाएं",
  "ui.go_next": "अगले पृष्ठ पर जाएं",
  "ui.more_pages": "अधिक पृष्ठ",
  "ui.sidebar": "साइडबार",
  "ui.sidebar_desc": "मोबाइल साइडबार प्रदर्शित करता है।",
  "ui.toggle_sidebar": "साइडबार टॉगल करें",

  "farm.showing_demo": "डेमो डेटा दिखा रहा है — बैकएंड",
  "farm.unreachable": "वर्तमान में पहुंच योग्य नहीं है।",
  "farm.acres": "एकड़",
  "index.rhizosense": "राइज़ोसेंस (RhizoSense)",
  "index.farm_portfolio": "खेत का पोर्टफोलियो",
  "index.add_new": "＋ नया खेत जोड़ें",

  "root.not_found": "पृष्ठ नहीं मिला",
  "root.not_found_desc": "आप जो पृष्ठ ढूंढ रहे हैं वह मौजूद नहीं है या ले जाया गया है।",
  "root.go_home": "होम पर जाएं",
  "root.error": "यह पृष्ठ लोड नहीं हुआ",
  "root.error_desc":
    "हमारी ओर से कुछ गलत हो गया है। आप रीफ्रेश करने का प्रयास कर सकते हैं या होम पर वापस जा सकते हैं।",
  "root.try_again": "पुनः प्रयास करें",
};

const newTe = {
  next: "తరువాత",
  previous: "మునుపటి",
  more: "మరింత",
  retry: "మళ్లీ ప్రయత్నించండి",

  "onboarding.farmer_name": "రైతు పేరు *",
  "onboarding.location": "స్థానం *",
  "onboarding.crop_type": "పంట రకం *",
  "onboarding.farm_area": "పొలం విస్తీర్ణం (ఎకరాలు) *",
  "onboarding.upload_title": "నేల నమూనా చిత్రాన్ని అప్‌లోడ్ చేయండి",
  "onboarding.upload_desc":
    "ఉత్పత్తిలో, ఇది ల్యాబ్ సీక్వెన్సింగ్‌ను ప్రేరేపిస్తుంది. ఈ డెమో కోసం, మేము విశ్లేషణను అనుకరిస్తాము.",
  "onboarding.preview_alt": "నేల నమూనా ప్రివ్యూ",
  "onboarding.drop_image": "నేల చిత్రాన్ని ఇక్కడ వదలండి లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి",
  "onboarding.sample_info":
    "మీ నమూనా 16S rRNA మెటాజెనోమిక్ సీక్వెన్సింగ్ పైప్‌లైన్‌ని ఉపయోగించి విశ్లేషించబడుతుంది",
  "onboarding.start_analysis": "విశ్లేషణను ప్రారంభించండి",
  "onboarding.analyzing": "మీ నేల నమూనాను విశ్లేషిస్తోంది…",
  "onboarding.analysis_complete": "విశ్లేషణ పూర్తయింది!",
  "onboarding.view_results": "ఫలితాలను వీక్షించండి",
  "onboarding.deficiencies_detected": "లోపాలు గుర్తించబడ్డాయి",
  "onboarding.top_recommendation": "అత్యుత్తమ సిఫార్సు",
  "onboarding.total_cost": "మొత్తం ఖర్చు",
  "onboarding.estimated_saving": "రసాయన ఎరువులపై అంచనా వేసిన ఆదా",
  "onboarding.view_dashboard": "పూర్తి డాష్‌బోర్డ్‌ను వీక్షించండి",
  "onboarding.back_home": "హోమ్‌కి తిరిగి వెళ్లండి",
  "onboarding.add_new_farm": "కొత్త పొలాన్ని జోడించండి",
  "onboarding.add_new_farm_desc":
    "నేల విశ్లేషణతో కొత్త పొలాన్ని జోడించడానికి ఆన్‌బోర్డింగ్ విజార్డ్",
  "onboarding.ph_farmer_name": "రైతు పేరును నమోదు చేయండి",
  "onboarding.ph_location": "ఉదాహరణకు కోయంబత్తూరు, తమిళనాడు",
  "onboarding.ph_crop": "పంట రకాన్ని ఎంచుకోండి",
  "onboarding.ph_area": "ఉదాహరణకు 3",
  "onboarding.step_1": "నేల చిత్రాన్ని ప్రాసెస్ చేస్తోంది...",
  "onboarding.step_2": "16S rRNA సీక్వెన్సింగ్‌ను అనుకరిస్తోంది...",
  "onboarding.step_3": "Kraken2 వర్గీకరణను అమలు చేస్తోంది...",
  "onboarding.step_4": "FAPROTAX ఫంక్షనల్ అనోటేషన్‌ను వర్తింపజేస్తోంది...",
  "onboarding.step_5": "Random Forest మోడల్‌తో ఆరోగ్య స్కోర్‌ను గణిస్తోంది...",
  "onboarding.step_6": "జీవ ఎరువుల సిఫార్సులను ఉత్పత్తి చేస్తోంది...",
  "onboarding.label_1": "పొలం వివరాలు",
  "onboarding.label_2": "నేల నమూనా",
  "onboarding.label_3": "ప్రాసెసింగ్",
  "onboarding.label_4": "ఫలితాలు",

  "recommendations.per_acre": "/ఎకరం · ₹",
  "recommendations.total": "మొత్తం",

  "score_factors.powered_by":
    "SHAP ద్వారా ఆధారితం — సగటు పొలంతో పోలిస్తే మీ స్కోర్‌ను పెంచిన లేదా తగ్గించిన సూక్ష్మజీవి కారకాలను చూపుతుంది.",

  "ui.breadcrumb": "బ్రెడ్‌క్రంబ్",
  "ui.previous_slide": "మునుపటి స్లయిడ్",
  "ui.next_slide": "తదుపరి స్లయిడ్",
  "ui.pagination": "పేజీల సంఖ్య",
  "ui.go_previous": "మునుపటి పేజీకి వెళ్లండి",
  "ui.go_next": "తదుపరి పేజీకి వెళ్లండి",
  "ui.more_pages": "మరిన్ని పేజీలు",
  "ui.sidebar": "సైడ్‌బార్",
  "ui.sidebar_desc": "మొబైల్ సైడ్‌బార్‌ను ప్రదర్శిస్తుంది.",
  "ui.toggle_sidebar": "సైడ్‌బార్‌ను టోగుల్ చేయండి",

  "farm.showing_demo": "డెమో డేటాను చూపుతోంది — బ్యాకెండ్",
  "farm.unreachable": "ప్రస్తుతం చేరుకోలేరు.",
  "farm.acres": "ఎకరాలు",
  "index.rhizosense": "రైజోసెన్స్ (RhizoSense)",
  "index.farm_portfolio": "పొలం పోర్ట్‌ఫోలియో",
  "index.add_new": "＋ కొత్త పొలాన్ని జోడించండి",

  "root.not_found": "పేజీ కనుగొనబడలేదు",
  "root.not_found_desc": "మీరు వెతుకుతున్న పేజీ లేదు లేదా తరలించబడింది.",
  "root.go_home": "హోమ్‌కి వెళ్లండి",
  "root.error": "ఈ పేజీ లోడ్ కాలేదు",
  "root.error_desc":
    "మా వైపు ఏదో తప్పు జరిగింది. మీరు రిఫ్రెష్ చేయడానికి ప్రయత్నించవచ్చు లేదా హోమ్‌కి తిరిగి వెళ్లవచ్చు.",
  "root.try_again": "మళ్లీ ప్రయత్నించండి",
};

// add these to the specific language files
function addKeysToFile(
  filePath: string,
  newKeysObj: Record<string, string>,
  isCommon: boolean = false,
) {
  let content = fs.readFileSync(filePath, "utf-8");

  // parse the object and append
  const keys = Object.keys(newKeysObj);
  for (const k of keys) {
    if (isCommon && !["next", "previous", "more", "retry"].includes(k)) continue;
    if (!isCommon && ["next", "previous", "more", "retry"].includes(k)) continue;

    const value = newKeysObj[k].replace(/"/g, '\\"');
    let keyName = k;
    if (keyName.includes(".")) {
      keyName = `"${keyName}"`;
    }
    // inject before the last closing brace
    content = content.replace(/};?\s*$/, `  ${keyName}: "${value}",\n};\n`);
  }
  fs.writeFileSync(filePath, content);
}

addKeysToFile(path.join(TRANS_DIR, "en.ts"), newEn);
addKeysToFile(path.join(TRANS_DIR, "ta.ts"), newTa);
addKeysToFile(path.join(TRANS_DIR, "hi.ts"), newHi);
addKeysToFile(path.join(TRANS_DIR, "te.ts"), newTe);

addKeysToFile(path.join(TRANS_DIR, "common", "en.ts"), newEn, true);
addKeysToFile(path.join(TRANS_DIR, "common", "ta.ts"), newTa, true);
addKeysToFile(path.join(TRANS_DIR, "common", "hi.ts"), newHi, true);
addKeysToFile(path.join(TRANS_DIR, "common", "te.ts"), newTe, true);

console.log("Keys added successfully.");
