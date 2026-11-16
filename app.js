const $=id=>document.getElementById(id);
const R={common:'#9aa4c4',rare:'#3b9cff',epic:'#b45cff',legendary:'#ffb81f',gem:'#54f1dc',limited:'#ff5d78',secret:'#ff48cf',admin:'#ff3b3b'};
const RK=['common','rare','epic','legendary'];
// Unified display order: Admin > Secret > Limited > GEM > Legendary > Epic > Rare > Common.
const RANK_ORDER=['common','rare','epic','legendary','gem','limited','secret','admin'];
const RANK_SCORE=Object.fromEntries(RANK_ORDER.map((rank,index)=>[rank,index]));
const GUNS={pistol:{n:'Pistol',r:'common',d:25,f:.3,p:1,s:.004,a:0,l:.6},smg:{n:'Viper SMG',r:'common',d:11,f:.08,p:1,s:.03,a:1,l:.9},shotgun:{n:'Boomstick',r:'rare',d:13,f:.8,p:8,s:.09,a:0,l:1.1},rifle:{n:'Striker AR',r:'epic',d:24,f:.13,p:1,s:.012,a:1,l:1.2},sniper:{n:'Longshot',r:'legendary',d:110,f:1.1,p:1,s:0,a:0,l:1.5},
 revolver:{n:'Deputy',r:'common',d:42,f:.5,p:1,s:.008,a:0,l:.7},scrapper:{n:'Scrapper',r:'common',d:8,f:.06,p:1,s:.05,a:1,l:.65},
 carbine:{n:'Burst Carbine',r:'rare',d:19,f:.1,p:1,s:.018,a:1,l:1.1},dmr:{n:'Hunter DMR',r:'rare',d:58,f:.55,p:1,s:.004,a:0,l:1.3},
 lmg:{n:'Thunder LMG',r:'epic',d:21,f:.08,p:1,s:.03,a:1,l:1.4},ripper:{n:'Ripper',r:'epic',d:11,f:.38,p:7,s:.08,a:1,l:1.0},
 rail:{n:'Railgun',r:'legendary',d:170,f:1.4,p:1,s:0,a:0,l:1.6},minigun:{n:'Inferno Minigun',r:'legendary',d:15,f:.045,p:1,s:.035,a:1,l:1.5},
 mac:{n:'Mac-10',r:'common',d:10,f:.07,p:1,s:.04,a:1,l:.75},sawed:{n:'Sawed-Off',r:'common',d:11,f:.9,p:6,s:.12,a:0,l:.8},
 scout:{n:'Scout Rifle',r:'rare',d:40,f:.4,p:1,s:.003,a:0,l:1.25},pump:{n:'Riot Pump',r:'rare',d:15,f:.65,p:9,s:.08,a:0,l:1.15},
 blaster:{n:'Plasma Blaster',r:'epic',d:30,f:.16,p:1,s:.01,a:1,l:1.1},marksman:{n:'Viper Marksman',r:'epic',d:85,f:.8,p:1,s:.001,a:0,l:1.45},
 doom:{n:'Doomsday Cannon',r:'legendary',d:22,f:.9,p:14,s:.07,a:0,l:1.3},reaper:{n:'Reaper AR',r:'legendary',d:34,f:.09,p:1,s:.008,a:1,l:1.3},
 rustbucketx:{n:'Rustbucket',r:'common',d:27,f:0.315,p:1,s:0.0066,a:0,l:0.65}, alleycatx:{n:'Alley Cat',r:'common',d:9,f:0.074,p:1,s:0.0385,a:1,l:0.85}, patchworkx:{n:'Patchwork',r:'common',d:19,f:0.126,p:1,s:0.0154,a:1,l:1.2}, dustdevilx:{n:'Dustdevil',r:'common',d:11,f:0.788,p:8,s:0.099,a:0,l:1.05},
 tinstarx:{n:'Tin Star',r:'common',d:40,f:0.578,p:1,s:0.0077,a:0,l:0.8}, pocketrocketx:{n:'Pocket Rocket',r:'common',d:9,f:0.074,p:1,s:0.0385,a:1,l:0.85}, oldfaithfulx:{n:'Old Faithful',r:'common',d:27,f:0.315,p:1,s:0.0066,a:0,l:0.65}, junkyardarx:{n:'Junkyard AR',r:'common',d:19,f:0.126,p:1,s:0.0154,a:1,l:1.2},
 gutterblasterx:{n:'Gutter Blaster',r:'common',d:9,f:0.42,p:6,s:0.088,a:1,l:1.0}, hobohunterx:{n:'Hobo Hunter',r:'common',d:45,f:0.525,p:1,s:0.0044,a:0,l:1.3}, pipedreamx:{n:'Pipe Dream',r:'common',d:11,f:0.788,p:8,s:0.099,a:0,l:1.05}, sparkplugx:{n:'Spark Plug',r:'common',d:9,f:0.074,p:1,s:0.0385,a:1,l:0.85},
 steelrainx:{n:'Steel Rain',r:'rare',d:11,f:0.07,p:1,s:0.035,a:1,l:0.85}, nightfallx:{n:'Nightfall',r:'rare',d:55,f:0.5,p:1,s:0.004,a:0,l:1.3}, bulldogx:{n:'Bulldog',r:'rare',d:11,f:0.4,p:6,s:0.08,a:1,l:1.0}, cobrax:{n:'Cobra',r:'rare',d:33,f:0.3,p:1,s:0.006,a:0,l:0.65},
 hammerheadx:{n:'Hammerhead',r:'rare',d:13,f:0.75,p:8,s:0.09,a:0,l:1.05}, rangerarx:{n:'Ranger AR',r:'rare',d:23,f:0.12,p:1,s:0.014,a:1,l:1.2}, wraithsmgx:{n:'Wraith SMG',r:'rare',d:11,f:0.07,p:1,s:0.035,a:1,l:0.85}, galeforcex:{n:'Gale Force',r:'rare',d:23,f:0.12,p:1,s:0.014,a:1,l:1.2},
 lockjawx:{n:'Lockjaw',r:'rare',d:50,f:0.55,p:1,s:0.007,a:0,l:0.8}, pathfinderx:{n:'Pathfinder',r:'rare',d:55,f:0.5,p:1,s:0.004,a:0,l:1.3}, stingerx:{n:'Stinger',r:'rare',d:33,f:0.3,p:1,s:0.006,a:0,l:0.65}, backdraftx:{n:'Backdraft',r:'rare',d:11,f:0.4,p:6,s:0.08,a:1,l:1.0},
 ironcladlmgx:{n:'Ironclad LMG',r:'rare',d:19,f:0.08,p:1,s:0.03,a:1,l:1.4}, valkyriex:{n:'Valkyrie',r:'epic',d:27,f:0.114,p:1,s:0.0119,a:1,l:1.2}, tempestx:{n:'Tempest',r:'epic',d:13,f:0.067,p:1,s:0.0298,a:1,l:0.85}, bansheex:{n:'Banshee',r:'epic',d:130,f:1.045,p:1,s:0.0,a:0,l:1.5},
 hellhoundx:{n:'Hellhound',r:'epic',d:13,f:0.38,p:6,s:0.068,a:1,l:1.0}, archammerx:{n:'Arc Hammer',r:'epic',d:58,f:0.522,p:1,s:0.0059,a:0,l:0.8}, gravediggerx:{n:'Gravedigger',r:'epic',d:16,f:0.712,p:8,s:0.0765,a:0,l:1.05}, phantomx:{n:'Phantom',r:'epic',d:65,f:0.475,p:1,s:0.0034,a:0,l:1.3},
 cyclonelmgx:{n:'Cyclone LMG',r:'epic',d:22,f:0.076,p:1,s:0.0255,a:1,l:1.4}, voltaicx:{n:'Voltaic',r:'epic',d:27,f:0.114,p:1,s:0.0119,a:1,l:1.2}, dragonflyx:{n:'Dragonfly',r:'epic',d:13,f:0.067,p:1,s:0.0298,a:1,l:0.85}, obsidianx:{n:'Obsidian',r:'epic',d:130,f:1.045,p:1,s:0.0,a:0,l:1.5},
 warlordx:{n:'Warlord',r:'epic',d:22,f:0.076,p:1,s:0.0255,a:1,l:1.4}, sirenx:{n:'Siren',r:'epic',d:39,f:0.285,p:1,s:0.0051,a:0,l:0.65}, excaliburx:{n:'Excalibur',r:'legendary',d:78,f:0.44,p:1,s:0.0028,a:0,l:1.3}, ragnarokx:{n:'Ragnarok',r:'legendary',d:19,f:0.66,p:8,s:0.063,a:0,l:1.05},
 supernovax:{n:'Supernova',r:'legendary',d:33,f:0.106,p:1,s:0.0098,a:1,l:1.2}, oblivionx:{n:'Oblivion',r:'legendary',d:155,f:0.968,p:1,s:0.0,a:0,l:1.5}, hydrax:{n:'Hydra',r:'legendary',d:16,f:0.352,p:6,s:0.056,a:1,l:1.0}, zeuscannonx:{n:'Zeus Cannon',r:'legendary',d:70,f:0.484,p:1,s:0.0049,a:0,l:0.8},
 apexpredatorx:{n:'Apex Predator',r:'legendary',d:16,f:0.062,p:1,s:0.0245,a:1,l:0.85}, titanlmgx:{n:'Titan LMG',r:'legendary',d:26,f:0.07,p:1,s:0.021,a:1,l:1.4}, eclipsex:{n:'Eclipse',r:'legendary',d:78,f:0.44,p:1,s:0.0028,a:0,l:1.3}, wyrmfangx:{n:'Wyrmfang',r:'legendary',d:46,f:0.264,p:1,s:0.0042,a:0,l:0.65},
 singularityx:{n:'Singularity',r:'legendary',d:155,f:0.968,p:1,s:0.0,a:0,l:1.5}, armageddonx:{n:'Armageddon',r:'legendary',d:16,f:0.352,p:6,s:0.056,a:1,l:1.0},
 dumpsterfirex:{n:'Dumpster Fire',r:'common',d:9,f:0.42,p:6,s:0.088,a:1,l:1.0}, scrapsniperx:{n:'Scrap Sniper',r:'common',d:90,f:1.155,p:1,s:0.0,a:0,l:1.5}, bentbarrelx:{n:'Bent Barrel',r:'common',d:19,f:0.126,p:1,s:0.0154,a:1,l:1.2}, budgetlmgx:{n:'Budget LMG',r:'common',d:15,f:0.084,p:1,s:0.033,a:1,l:1.4},
 peashooterx:{n:'Peashooter',r:'common',d:27,f:0.315,p:1,s:0.0066,a:0,l:0.65}, longbowx:{n:'Longbow',r:'rare',d:110,f:1.1,p:1,s:0,a:0,l:1.5}, riotcontrolx:{n:'Riot Control',r:'rare',d:11,f:0.4,p:6,s:0.08,a:1,l:1.0}, falconx:{n:'Falcon',r:'rare',d:23,f:0.12,p:1,s:0.014,a:1,l:1.2},
 tomcatx:{n:'Tomcat',r:'rare',d:11,f:0.07,p:1,s:0.035,a:1,l:0.85}, gunslingerx:{n:'Gunslinger',r:'rare',d:50,f:0.55,p:1,s:0.007,a:0,l:0.8}, neonreaperx:{n:'Neon Reaper',r:'epic',d:13,f:0.067,p:1,s:0.0298,a:1,l:0.85}, stormbringerx:{n:'Stormbringer',r:'epic',d:27,f:0.114,p:1,s:0.0119,a:1,l:1.2},
 thunderclapx:{n:'Thunderclap',r:'epic',d:16,f:0.712,p:8,s:0.0765,a:0,l:1.05}, eagleeyex:{n:'Eagle Eye',r:'epic',d:65,f:0.475,p:1,s:0.0034,a:0,l:1.3}, juggernautx:{n:'Juggernaut',r:'epic',d:22,f:0.076,p:1,s:0.0255,a:1,l:1.4}, dragonbreathx:{n:'Dragonbreath',r:'legendary',d:19,f:0.66,p:8,s:0.063,a:0,l:1.05},
 voidwalkerx:{n:'Void Walker',r:'legendary',d:33,f:0.106,p:1,s:0.0098,a:1,l:1.2}, starfallx:{n:'Starfall',r:'legendary',d:155,f:0.968,p:1,s:0.0,a:0,l:1.5}, chaosenginex:{n:'Chaos Engine',r:'legendary',d:26,f:0.07,p:1,s:0.021,a:1,l:1.4}, judgmentx:{n:'Judgment',r:'legendary',d:70,f:0.484,p:1,s:0.0049,a:0,l:0.8},
 ricketyrifle2x:{n:'Rickety Rifle',r:'common',d:20,f:.13,p:1,s:.014,a:1,l:1.2}, tinpopperx:{n:'Tin Popper',r:'common',d:28,f:.3,p:1,s:.007,a:0,l:.65}, rustyscatterx:{n:'Rusty Scatter',r:'common',d:10,f:.45,p:6,s:.09,a:1,l:1.0}, stubbyx:{n:'Stubby',r:'common',d:10,f:.075,p:1,s:.034,a:1,l:.85}, hunterboltx:{n:'Hunter Bolt',r:'common',d:85,f:1.1,p:1,s:0,a:0,l:1.5},
 vandalx:{n:'Vandal',r:'rare',d:24,f:.115,p:1,s:.013,a:1,l:1.2}, scattershotx:{n:'Scattershot',r:'rare',d:12,f:.75,p:8,s:.09,a:0,l:1.1}, duelistx:{n:'Duelist',r:'rare',d:48,f:.5,p:1,s:.007,a:0,l:.8}, hornetx:{n:'Hornet',r:'rare',d:11,f:.068,p:1,s:.034,a:1,l:.85}, marksmanx:{n:'Marksman',r:'rare',d:105,f:1.05,p:1,s:0,a:0,l:1.5},
 specterx:{n:'Specter',r:'epic',d:26,f:.11,p:1,s:.011,a:1,l:1.25}, blastmasterx:{n:'Blastmaster',r:'epic',d:17,f:.7,p:8,s:.075,a:0,l:1.05}, vipergunx:{n:'Viper Fang',r:'epic',d:13,f:.065,p:1,s:.03,a:1,l:.85}, deadeyex:{n:'Deadeye',r:'epic',d:68,f:.48,p:1,s:.0035,a:0,l:1.3}, bulwarkx:{n:'Bulwark',r:'epic',d:21,f:.075,p:1,s:.025,a:1,l:1.4},
 cataclysmx:{n:'Cataclysm',r:'legendary',d:160,f:.97,p:1,s:0,a:0,l:1.5}, maelstromx:{n:'Maelstrom',r:'legendary',d:17,f:.06,p:1,s:.024,a:1,l:.85}, wraithx:{n:'Wraith',r:'legendary',d:34,f:.1,p:1,s:.0095,a:1,l:1.2}, doomsdayx:{n:'Doomsday',r:'legendary',d:19,f:.65,p:8,s:.063,a:0,l:1.05}, celestialx:{n:'Celestial',r:'legendary',d:75,f:.45,p:1,s:.003,a:0,l:1.3},
 pebblepitcherx:{n:'Pebble Pitcher',r:'common',d:25.5,f:0.3,p:1,s:0.006,a:0,l:0.65}, garagegatx:{n:'Garage Gat',r:'common',d:9.3,f:0.07,p:1,s:0.033,a:1,l:0.88}, handcannonjrx:{n:'Hand Cannon Jr',r:'common',d:25.5,f:0.3,p:1,s:0.006,a:0,l:0.65}, pocketsprayx:{n:'Pocket Spray',r:'common',d:9.3,f:0.07,p:1,s:0.033,a:1,l:0.88}, beaterarx:{n:'Beater AR',r:'common',d:20.4,f:0.12,p:1,s:0.012,a:1,l:1.2}, rookiepumpx:{n:'Rookie Pump',r:'common',d:11.0,f:0.7,p:8,s:0.08,a:0,l:1.05},
 banditx:{n:'Bandit',r:'rare',d:11,f:0.07,p:1,s:0.033,a:1,l:0.88}, trailblazerx:{n:'Trailblazer',r:'rare',d:24,f:0.12,p:1,s:0.012,a:1,l:1.2}, breacherx:{n:'Breacher',r:'rare',d:13,f:0.7,p:8,s:0.08,a:0,l:1.05}, sentinelx:{n:'Sentinel',r:'rare',d:80,f:0.9,p:1,s:0.002,a:0,l:1.45}, outlawx:{n:'Outlaw',r:'rare',d:30,f:0.3,p:1,s:0.006,a:0,l:0.65}, twisterx:{n:'Twister',r:'rare',d:15,f:0.38,p:6,s:0.06,a:1,l:1.0}, patriotx:{n:'Patriot',r:'rare',d:24,f:0.12,p:1,s:0.012,a:1,l:1.2},
 grimx:{n:'Grim',r:'epic',d:27.6,f:0.12,p:1,s:0.012,a:1,l:1.2}, ironhidex:{n:'Ironhide',r:'epic',d:20.7,f:0.07,p:1,s:0.024,a:1,l:1.4}, havocx:{n:'Havoc',r:'epic',d:17.2,f:0.38,p:6,s:0.06,a:1,l:1.0}, nighthawkx:{n:'Nighthawk',r:'epic',d:92.0,f:0.9,p:1,s:0.002,a:0,l:1.45}, barragex:{n:'Barrage',r:'epic',d:12.6,f:0.07,p:1,s:0.033,a:1,l:0.88}, steelstormx:{n:'Steelstorm',r:'epic',d:20.7,f:0.07,p:1,s:0.024,a:1,l:1.4}, ricochetx:{n:'Ricochet',r:'epic',d:34.5,f:0.3,p:1,s:0.006,a:0,l:0.65},
 annihilatorx:{n:'Annihilator',r:'legendary',d:23.4,f:0.07,p:1,s:0.024,a:1,l:1.4}, seraphx:{n:'Seraph',r:'legendary',d:104.0,f:0.9,p:1,s:0.002,a:0,l:1.45}, hellfirex:{n:'Hellfire',r:'legendary',d:19.5,f:0.38,p:6,s:0.06,a:1,l:1.0}, leviathanx:{n:'Leviathan',r:'legendary',d:16.9,f:0.7,p:8,s:0.08,a:0,l:1.05}, nebulax:{n:'Nebula',r:'legendary',d:31.2,f:0.12,p:1,s:0.012,a:1,l:1.2}, harpyx:{n:'Harpy',r:'legendary',d:14.3,f:0.07,p:1,s:0.033,a:1,l:0.88}, megalithx:{n:'Megalith',r:'legendary',d:104.0,f:0.9,p:1,s:0.002,a:0,l:1.45}, pandemoniumx:{n:'Pandemonium',r:'legendary',d:19.5,f:0.38,p:6,s:0.06,a:1,l:1.0},
 tinkerx:{n:'Tinker Tommy',r:'common',d:9.4,f:.07,p:1,s:.033,a:1,l:.88}, skirmisherx:{n:'Skirmisher',r:'rare',d:24,f:.12,p:1,s:.012,a:1,l:1.2},
 candycornx:{n:'Candy Corn Blaster',r:'common',d:11,f:.07,p:1,s:.035,a:1,l:.9,x:'spooky'},
 pumpkinsmasherx:{n:'Pumpkin Smasher',r:'rare',d:15,f:.7,p:9,s:.085,a:0,l:1.1,x:'spooky'},
 witchfirex:{n:'Witchfire',r:'epic',d:28,f:.11,p:1,s:.01,a:1,l:1.25,x:'spooky'},
 ghoulgatlingx:{n:'Ghoul Gatling',r:'legendary',d:17,f:.05,p:1,s:.03,a:1,l:1.5,x:'spooky'},
 headlesshorsemanx:{n:'Headless Horseman',r:'legendary',d:175,f:1.2,p:1,s:0,a:0,l:1.6,x:'spooky'},
 pixelpistolx:{n:'Pixel Pistol',r:'common',d:30,f:.28,p:1,s:.007,a:0,l:.7,x:'og',px:1},
 bitblasterx:{n:'8-Bit Blaster',r:'rare',d:11,f:.065,p:1,s:.03,a:1,l:.95,x:'og',px:1},
 arcadearx:{n:'Arcade AR',r:'epic',d:27,f:.11,p:1,s:.01,a:1,l:1.25,x:'og',px:1},
 gameoverx:{n:'Game Over',r:'legendary',d:180,f:1.15,p:1,s:0,a:0,l:1.6,x:'og',px:1},
 finalbossx:{n:'Final Boss',r:'legendary',d:15,f:.045,p:1,s:.03,a:1,l:1.5,x:'og',px:1}};

// The complete in-game weapon catalogue contains exactly 500 guns: 151 core + 299 vault + 50 Gem Store weapons.
const EXTRA_GUN_PREFIXES=['Aether','Ashen','Atomic','Aurora','Blackout','Bluefire','Carbon','Celestial','Chrome','Crimson','Cyber','Darkstar','Deadlock','Dread','Ember','Enigma','Frostbite','Ghost','Golden','Hyper','Iron','Jade','Midnight','Neon','Obsidian'];
const EXTRA_GUN_MODELS=['Viper','Warden','Spectre','Phantom','Sentinel','Raptor','Tempest','Marauder','Striker','Nomad','Catalyst','Vanguard','Revenant','Starlight','Titan','Ranger','Outrider','Mirage','Overdrive','Nightjar'];
const EXTRA_GUN_FAMILIES=['pistol','revolver','smg','rifle','shotgun','sniper','lmg','energy'];
const EXTRA_GUN_STATS={
 pistol:{d:24,f:.29,p:1,s:.006,a:0,l:.68},revolver:{d:43,f:.48,p:1,s:.008,a:0,l:.76},
 smg:{d:10,f:.073,p:1,s:.033,a:1,l:.88},rifle:{d:23,f:.122,p:1,s:.013,a:1,l:1.18},
 shotgun:{d:12,f:.74,p:8,s:.082,a:0,l:1.08},sniper:{d:82,f:.92,p:1,s:.002,a:0,l:1.48},
 lmg:{d:18,f:.078,p:1,s:.027,a:1,l:1.38},energy:{d:28,f:.17,p:1,s:.009,a:1,l:1.12}
};
const EXTRA_GUNS=(()=>{
 const out={};
 for(let i=0;i<299;i++){
  const prefix=EXTRA_GUN_PREFIXES[Math.floor(i/20)],model=EXTRA_GUN_MODELS[i%20],name=prefix+' '+model;
  const family=EXTRA_GUN_FAMILIES[(i*7+Math.floor(i/20))%EXTRA_GUN_FAMILIES.length];
  const rarity=RK[Math.min(3,Math.floor(i/125))],tier=RK.indexOf(rarity),base=EXTRA_GUN_STATS[family];
  const variant=(i%10),scale=1+tier*.055+(variant-4.5)*.009;
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  out['vault_'+String(i+1).padStart(3,'0')+'_'+slug]={
   n:name,r:rarity,d:Math.max(7,Math.round(base.d*scale*10)/10),
   f:Math.max(.045,Math.round(base.f*(1+(variant-4.5)*.018)*1000)/1000),
   p:base.p,s:Math.max(0,Math.round(base.s*(1+(variant-4.5)*.035)*10000)/10000),
   a:base.a,l:Math.round(base.l*(.91+(variant%5)*.045)*100)/100,
   family,design:1000+i,finish:i%6,series:'vault'
  };
 }
 return out;
})();
Object.assign(GUNS,EXTRA_GUNS);

// KittyGems market catalogue: 40 normal guns (also in normal crate pools) + 10 exclusive GEM-rank guns.
const KITTY_GEM_NORMALS=[
 ['copperhead_sidearm','Copperhead Sidearm','common','pistol'],['frostline_pistol','Frostline Pistol','common','pistol'],['brass_knuckle_revolver','Brass Knuckle','common','revolver'],['rattletrap_smg','Rattletrap SMG','common','smg'],['yardstick_rifle','Yardstick Rifle','common','rifle'],
 ['dustpan_shotgun','Dustpan Shotgun','common','shotgun'],['tinroof_scout','Tinroof Scout','common','sniper'],['workhorse_lmg','Workhorse LMG','common','lmg'],['sparrow_burst','Sparrow Burst','common','rifle'],['pocket_arc','Pocket Arc','common','energy'],
 ['bluejay_revolver','Bluejay Revolver','rare','revolver'],['icebreaker_smg','Icebreaker SMG','rare','smg'],['redline_carbine','Redline Carbine','rare','rifle'],['thunder_muzzle','Thunder Muzzle','rare','shotgun'],['longmile_rifle','Longmile Rifle','rare','sniper'],
 ['rivet_lmg','Rivet LMG','rare','lmg'],['pulse_driver','Pulse Driver','rare','energy'],['switchback_pistol','Switchback Pistol','rare','pistol'],['brimstone_burst','Brimstone Burst','rare','rifle'],['wildcard_auto','Wildcard Auto','rare','smg'],
 ['glacier_repeater','Glacier Repeater','epic','rifle'],['blackice_cannon','Blackice Cannon','epic','shotgun'],['aftershock_smg','Aftershock SMG','epic','smg'],['cobalt_marksman','Cobalt Marksman','epic','sniper'],['kingfisher_lmg','Kingfisher LMG','epic','lmg'],
 ['ion_revolver','Ion Revolver','epic','revolver'],['radiant_pistol','Radiant Pistol','epic','pistol'],['stormcell_blaster','Stormcell Blaster','epic','energy'],['wildfire_carbine','Wildfire Carbine','epic','rifle'],['quarry_breaker','Quarry Breaker','epic','shotgun'],
 ['sunforge_rifle','Sunforge Rifle','legendary','rifle'],['deepvoid_sniper','Deepvoid Sniper','legendary','sniper'],['monarch_minigun','Monarch Minigun','legendary','lmg'],['starlit_blaster','Starlit Blaster','legendary','energy'],['redshift_revolver','Redshift Revolver','legendary','revolver'],
 ['cathedral_smg','Cathedral SMG','legendary','smg'],['crownfall_shotgun','Crownfall Shotgun','legendary','shotgun'],['emberline_pistol','Emberline Pistol','legendary','pistol'],['highnoon_marksman','Highnoon Marksman','legendary','sniper'],['thunderbird_ar','Thunderbird AR','legendary','rifle']
];
const KITTY_GEM_RANKS=[
 ['aurora_breaker','Aurora Breaker','sniper',160],['prism_tempest','Prism Tempest','energy',180],['starcore_repeater','Starcore Repeater','rifle',200],['quantum_drum','Quantum Drum','lmg',220],['nova_scatter','Nova Scatter','shotgun',240],
 ['voidfang_revolver','Voidfang Revolver','revolver',260],['celestial_smg','Celestial SMG','smg',280],['singularity_lance','Singularity Lance','energy',320],['nebula_longshot','Nebula Longshot','sniper',360],['infinity_crown','Infinity Crown','rifle',420]
];
KITTY_GEM_NORMALS.forEach(([id,name,rarity,family],i)=>{
 const base=EXTRA_GUN_STATS[family],tier=RK.indexOf(rarity),v=i%5,scale=1+tier*.07+(v-2)*.012;
 GUNS[id]={n:name,r:rarity,d:Math.round(base.d*scale*10)/10,f:Math.max(.045,base.f*(1+(v-2)*.025)),p:base.p,s:Math.max(0,base.s*(1+(v-2)*.045)),a:base.a,l:base.l,family,design:2400+i,finish:i%6,series:'kitty-gem-market',gemStore:true,gemPrice:[8,14,22,34][tier]};
});
KITTY_GEM_RANKS.forEach(([id,name,family,price],i)=>{
 const base=EXTRA_GUN_STATS[family],scale=1.35+i*.045;
 GUNS[id]={n:name,r:'gem',rank:'GEM',gem:true,d:Math.round(base.d*scale*10)/10,f:Math.max(.04,base.f*.88),p:base.p,s:Math.max(0,base.s*.78),a:base.a,l:base.l*1.08,family,design:3200+i,finish:i%6,series:'kitty-gem-exclusive',gemStore:true,gemPrice:price};
});

// Event-only weapons are separate from the 500-gun standard catalogue.
// They are only added to a specific Limited Crate's hidden bonus-drop pool.
const EVENT_GUNS={
  "easterflare": {
    "n": "Easterflare",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "easter",
    "d": 42,
    "f": 0.12,
    "p": 1,
    "s": 0.012,
    "a": 1,
    "l": 1.18,
    "family": "energy",
    "design": 5100,
    "series": "easter-event"
  },
  "harebringer": {
    "n": "Harebringer",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "easter",
    "d": 48,
    "f": 0.11,
    "p": 1,
    "s": 0.009,
    "a": 1,
    "l": 1.22,
    "family": "rifle",
    "design": 5101,
    "series": "easter-event"
  },
  "eggclipse": {
    "n": "Eggclipse",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "easter",
    "d": 95,
    "f": 0.72,
    "p": 1,
    "s": 0.002,
    "a": 0,
    "l": 1.42,
    "family": "sniper",
    "design": 5102,
    "series": "easter-event"
  },
  "frostpop": {
    "n": "Frostpop",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "popsicle",
    "d": 38,
    "f": 0.09,
    "p": 1,
    "s": 0.014,
    "a": 1,
    "l": 0.92,
    "family": "smg",
    "design": 5110,
    "series": "popsicle-event"
  },
  "brainfreeze": {
    "n": "Brainfreeze",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "popsicle",
    "d": 120,
    "f": 0.96,
    "p": 1,
    "s": 0,
    "a": 0,
    "l": 1.48,
    "family": "sniper",
    "design": 5111,
    "series": "popsicle-event"
  },
  "glacierghost": {
    "n": "Glacier Ghost",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "popsicle",
    "d": 50,
    "f": 0.12,
    "p": 1,
    "s": 0.008,
    "a": 1,
    "l": 1.25,
    "family": "energy",
    "design": 5112,
    "series": "popsicle-event"
  },
  "cloverstrike": {
    "n": "Cloverstrike",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "clover",
    "d": 44,
    "f": 0.14,
    "p": 1,
    "s": 0.01,
    "a": 1,
    "l": 1.12,
    "family": "rifle",
    "design": 5120,
    "series": "clover-event"
  },
  "fourleafphantom": {
    "n": "Four-Leaf Phantom",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "clover",
    "d": 58,
    "f": 0.46,
    "p": 1,
    "s": 0.003,
    "a": 0,
    "l": 1.38,
    "family": "sniper",
    "design": 5121,
    "series": "clover-event"
  },
  "leprechaunwhisper": {
    "n": "Leprechaun's Whisper",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "clover",
    "d": 46,
    "f": 0.1,
    "p": 1,
    "s": 0.01,
    "a": 1,
    "l": 1.3,
    "family": "energy",
    "design": 5122,
    "series": "clover-event"
  },
  "northstar": {
    "n": "Northstar",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "christmas",
    "d": 55,
    "f": 0.2,
    "p": 1,
    "s": 0.006,
    "a": 1,
    "l": 1.3,
    "family": "energy",
    "design": 5130,
    "series": "christmas-event"
  },
  "yulebeam": {
    "n": "Yulebeam",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "christmas",
    "d": 72,
    "f": 0.48,
    "p": 1,
    "s": 0.002,
    "a": 0,
    "l": 1.45,
    "family": "sniper",
    "design": 5131,
    "series": "christmas-event"
  },
  "silentnight": {
    "n": "Silent Night",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "christmas",
    "d": 49,
    "f": 0.11,
    "p": 1,
    "s": 0.008,
    "a": 1,
    "l": 1.28,
    "family": "rifle",
    "design": 5132,
    "series": "christmas-event"
  },
  "gravewhisper": {
    "n": "Grave Whisper",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "spooky",
    "d": 62,
    "f": 0.44,
    "p": 1,
    "s": 0.003,
    "a": 0,
    "l": 1.44,
    "family": "sniper",
    "design": 5140,
    "series": "spooky-event"
  },
  "candycovenant": {
    "n": "Candy Covenant",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "spooky",
    "d": 45,
    "f": 0.105,
    "p": 1,
    "s": 0.009,
    "a": 1,
    "l": 1.26,
    "family": "energy",
    "design": 5141,
    "series": "spooky-event"
  },
  "pixelphantom": {
    "n": "Pixel Phantom",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "og",
    "d": 52,
    "f": 0.12,
    "p": 1,
    "s": 0.008,
    "a": 1,
    "l": 1.24,
    "family": "rifle",
    "design": 5150,
    "series": "og-event"
  },
  "lastlegacy": {
    "n": "Last Legacy",
    "r": "legendary",
    "rank": "SECRET",
    "secret": true,
    "x": "og",
    "d": 105,
    "f": 0.84,
    "p": 1,
    "s": 0.001,
    "a": 0,
    "l": 1.5,
    "family": "sniper",
    "design": 5151,
    "series": "og-event"
  }
};
Object.assign(EVENT_GUNS, {
  "petalburst": {
    "n": "Petalburst",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "easter",
    "eventTheme": "easter",
    "eventStyle": 1,
    "d": 46,
    "f": 0.115,
    "p": 1,
    "s": 0.008,
    "a": 1,
    "l": 1.12,
    "family": "energy",
    "design": 5200,
    "series": "easter-event"
  },
  "hatchlingnova": {
    "n": "Hatchling Nova",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "easter",
    "eventTheme": "easter",
    "eventStyle": 2,
    "d": 52,
    "f": 0.14,
    "p": 1,
    "s": 0.01,
    "a": 1,
    "l": 1.18,
    "family": "rifle",
    "design": 5201,
    "series": "easter-event"
  },
  "springtide": {
    "n": "Springtide",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "easter",
    "eventTheme": "easter",
    "eventStyle": 3,
    "d": 31,
    "f": 0.76,
    "p": 8,
    "s": 0.07,
    "a": 0,
    "l": 1.08,
    "family": "shotgun",
    "design": 5202,
    "series": "easter-event"
  },
  "bloomwarden": {
    "n": "Bloomwarden",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "easter",
    "eventTheme": "easter",
    "eventStyle": 4,
    "d": 39,
    "f": 0.095,
    "p": 1,
    "s": 0.012,
    "a": 1,
    "l": 1.22,
    "family": "smg",
    "design": 5203,
    "series": "easter-event"
  },
  "sugarshard": {
    "n": "Sugarshard",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "popsicle",
    "eventTheme": "popsicle",
    "eventStyle": 1,
    "d": 34,
    "f": 0.11,
    "p": 1,
    "s": 0.009,
    "a": 1,
    "l": 0.96,
    "family": "energy",
    "design": 5210,
    "series": "popsicle-event"
  },
  "glacierpop": {
    "n": "Glacier Pop",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "popsicle",
    "eventTheme": "popsicle",
    "eventStyle": 2,
    "d": 36,
    "f": 0.72,
    "p": 8,
    "s": 0.075,
    "a": 0,
    "l": 1.02,
    "family": "shotgun",
    "design": 5211,
    "series": "popsicle-event"
  },
  "chillwave": {
    "n": "Chillwave",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "popsicle",
    "eventTheme": "popsicle",
    "eventStyle": 3,
    "d": 44,
    "f": 0.13,
    "p": 1,
    "s": 0.01,
    "a": 1,
    "l": 1.2,
    "family": "rifle",
    "design": 5212,
    "series": "popsicle-event"
  },
  "blueberryfreeze": {
    "n": "Blueberry Freeze",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "popsicle",
    "eventTheme": "popsicle",
    "eventStyle": 4,
    "d": 29,
    "f": 0.082,
    "p": 1,
    "s": 0.015,
    "a": 1,
    "l": 0.88,
    "family": "smg",
    "design": 5213,
    "series": "popsicle-event"
  },
  "goldenharvest": {
    "n": "Golden Harvest",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "clover",
    "eventTheme": "clover",
    "eventStyle": 1,
    "d": 78,
    "f": 0.88,
    "p": 1,
    "s": 0.002,
    "a": 0,
    "l": 1.46,
    "family": "sniper",
    "design": 5220,
    "series": "clover-event"
  },
  "shamrocksurge": {
    "n": "Shamrock Surge",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "clover",
    "eventTheme": "clover",
    "eventStyle": 2,
    "d": 43,
    "f": 0.12,
    "p": 1,
    "s": 0.009,
    "a": 1,
    "l": 1.18,
    "family": "rifle",
    "design": 5221,
    "series": "clover-event"
  },
  "luckyspark": {
    "n": "Lucky Spark",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "clover",
    "eventTheme": "clover",
    "eventStyle": 3,
    "d": 36,
    "f": 0.15,
    "p": 1,
    "s": 0.008,
    "a": 1,
    "l": 1.08,
    "family": "energy",
    "design": 5222,
    "series": "clover-event"
  },
  "emeraldwhirl": {
    "n": "Emerald Whirl",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "clover",
    "eventTheme": "clover",
    "eventStyle": 4,
    "d": 27,
    "f": 0.078,
    "p": 1,
    "s": 0.025,
    "a": 1,
    "l": 1.42,
    "family": "lmg",
    "design": 5223,
    "series": "clover-event"
  },
  "jinglebolt": {
    "n": "Jinglebolt",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "christmas",
    "eventTheme": "christmas",
    "eventStyle": 1,
    "d": 41,
    "f": 0.12,
    "p": 1,
    "s": 0.009,
    "a": 1,
    "l": 1.18,
    "family": "rifle",
    "design": 5230,
    "series": "christmas-event"
  },
  "mistletoearc": {
    "n": "Mistletoe Arc",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "christmas",
    "eventTheme": "christmas",
    "eventStyle": 2,
    "d": 47,
    "f": 0.14,
    "p": 1,
    "s": 0.01,
    "a": 1,
    "l": 1.15,
    "family": "energy",
    "design": 5231,
    "series": "christmas-event"
  },
  "snowglobe": {
    "n": "Snowglobe",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "christmas",
    "eventTheme": "christmas",
    "eventStyle": 3,
    "d": 83,
    "f": 0.9,
    "p": 1,
    "s": 0.002,
    "a": 0,
    "l": 1.5,
    "family": "sniper",
    "design": 5232,
    "series": "christmas-event"
  },
  "hollystorm": {
    "n": "Hollystorm",
    "r": "legendary",
    "rank": "LIMITED",
    "limited": true,
    "x": "christmas",
    "eventTheme": "christmas",
    "eventStyle": 4,
    "d": 33,
    "f": 0.78,
    "p": 8,
    "s": 0.074,
    "a": 0,
    "l": 1.1,
    "family": "shotgun",
    "design": 5233,
    "series": "christmas-event"
  }
});

// Complete the Spooky and OG event collections: five Limited items per crate.
Object.assign(EVENT_GUNS, {
  witchlight_repeater:{n:"Witchlight Repeater",r:'legendary',rank:'LIMITED',limited:true,x:"spooky",eventTheme:"spooky",eventStyle:0,d:44,f:0.14,p:1,s:0.009,a:1,l:1.16,family:"energy",design:5160,series:'spooky-event'},
  pumpkin_payload:{n:"Pumpkin Payload",r:'legendary',rank:'LIMITED',limited:true,x:"spooky",eventTheme:"spooky",eventStyle:1,d:34,f:0.74,p:8,s:0.074,a:0,l:1.08,family:"shotgun",design:5161,series:'spooky-event'},
  graveyard_grin:{n:"Graveyard Grin",r:'legendary',rank:'LIMITED',limited:true,x:"spooky",eventTheme:"spooky",eventStyle:2,d:39,f:0.12,p:1,s:0.012,a:1,l:1.18,family:"rifle",design:5162,series:'spooky-event'},
  batwing_burst:{n:"Batwing Burst",r:'legendary',rank:'LIMITED',limited:true,x:"spooky",eventTheme:"spooky",eventStyle:3,d:28,f:0.082,p:1,s:0.015,a:1,l:0.9,family:"smg",design:5163,series:'spooky-event'},
  jackolantern_lmg:{n:"Jack-o-Lantern LMG",r:'legendary',rank:'LIMITED',limited:true,x:"spooky",eventTheme:"spooky",eventStyle:4,d:25,f:0.085,p:1,s:0.03,a:1,l:1.38,family:"lmg",design:5164,series:'spooky-event'},
  pixel_popper:{n:"Pixel Popper",r:'legendary',rank:'LIMITED',limited:true,x:"og",eventTheme:"og",eventStyle:0,d:32,f:0.29,p:1,s:0.006,a:0,l:0.72,family:"pistol",design:5170,series:'og-event'},
  cartridge_cannon:{n:"Cartridge Cannon",r:'legendary',rank:'LIMITED',limited:true,x:"og",eventTheme:"og",eventStyle:1,d:37,f:0.78,p:8,s:0.076,a:0,l:1.12,family:"shotgun",design:5171,series:'og-event'},
  arcade_vanguard:{n:"Arcade Vanguard",r:'legendary',rank:'LIMITED',limited:true,x:"og",eventTheme:"og",eventStyle:2,d:42,f:0.125,p:1,s:0.011,a:1,l:1.2,family:"rifle",design:5172,series:'og-event'},
  blockbuster_burst:{n:"Blockbuster Burst",r:'legendary',rank:'LIMITED',limited:true,x:"og",eventTheme:"og",eventStyle:3,d:30,f:0.084,p:1,s:0.014,a:1,l:0.92,family:"smg",design:5173,series:'og-event'},
  boss_rush_lmg:{n:"Boss Rush LMG",r:'legendary',rank:'LIMITED',limited:true,x:"og",eventTheme:"og",eventStyle:4,d:29,f:0.08,p:1,s:0.027,a:1,l:1.42,family:"lmg",design:5174,series:'og-event'},
});

// Hidden Gem Crate-only Secret weapon. It is deliberately not gemStore:true,
// so it does not appear in the public Gem Crate contents list or rarity meter.
EVENT_GUNS.gemheart_singularity={
 n:'Gemheart Singularity',r:'legendary',rank:'SECRET',secret:true,x:'gem',eventTheme:'gem',eventStyle:0,
 d:78,f:.31,p:1,s:.004,a:1,l:1.48,family:'energy',design:5300,series:'kittygem-secret'
};

// ADMIN-rank weapons: only from the Admin Crate. Keep identical to server/index.js.
Object.assign(EVENT_GUNS,{
 admin_banhammer:{n:'Ban Hammer',r:'legendary',rank:'ADMIN',admin:true,d:38,f:.7,p:9,s:.07,a:0,l:1.2,family:'shotgun',design:5400,series:'admin-exclusive'},
 admin_sudo_rifle:{n:'Sudo Rifle',r:'legendary',rank:'ADMIN',admin:true,d:46,f:.1,p:1,s:.008,a:1,l:1.3,family:'rifle',design:5401,series:'admin-exclusive'},
 admin_root_access:{n:'Root Access',r:'legendary',rank:'ADMIN',admin:true,d:30,f:.06,p:1,s:.012,a:1,l:1,family:'smg',design:5402,series:'admin-exclusive'},
 admin_kernel_panic:{n:'Kernel Panic',r:'legendary',rank:'ADMIN',admin:true,d:34,f:.07,p:1,s:.02,a:1,l:1.45,family:'lmg',design:5403,series:'admin-exclusive'},
 admin_decree:{n:"Admin's Decree",r:'legendary',rank:'ADMIN',admin:true,d:120,f:.8,p:1,s:.001,a:0,l:1.6,family:'sniper',design:5404,series:'admin-exclusive'}
});

const MAIN_GUN_IDS=Object.keys(GUNS);
Object.assign(GUNS,EVENT_GUNS);

const SKINS={default:{n:'Factory Gray',r:'common',c:0x777b88},neon:{n:'Neon Green',r:'common',c:0x39ff14},crimson:{n:'Crimson',r:'rare',c:0xdc143c},ice:{n:'Glacier',r:'epic',c:0x66ccff},gold:{n:'Midas Gold',r:'legendary',c:0xffd23f},void:{n:'Void Purple',r:'legendary',c:0x8a2be2},sakura:{n:'Sakura Pink',r:'common',c:0xff9ecb},ember:{n:'Ember Orange',r:'rare',c:0xff6a00},ocean:{n:'Deep Ocean',r:'rare',c:0x1e6fff},shadow:{n:'Shadow Black',r:'epic',c:0x22222e},aurora:{n:'Aurora',r:'legendary',c:0x00ffc8},snow:{n:'Snowfall White',r:'common',c:0xf2f6ff},mint:{n:'Mint',r:'common',c:0x7dffb3},sunshine:{n:'Sunshine',r:'common',c:0xffe45c},violet:{n:'Violet',r:'rare',c:0x9b5cff},cobalt:{n:'Cobalt',r:'rare',c:0x0047ab},blaze:{n:'Blaze',r:'epic',c:0xff3b1f},toxic:{n:'Toxic Waste',r:'epic',c:0xb6ff00},magma:{n:'Magma',r:'legendary',c:0xff4500},galaxy:{n:'Galaxy',r:'legendary',c:0x3a1c9e},diamond:{n:'Diamond',r:'legendary',c:0xb9f2ff}};

// Twenty extra full-weapon finishes, each with its own body and trim colours.
const EXTRA_SKINS={
 ruby:{n:'Ruby Circuit',r:'rare',c:0xb51236,a:0xffd4dd,finish:'gloss'},sapphire:{n:'Sapphire Pulse',r:'rare',c:0x1453c7,a:0x75ddff,finish:'metal'},emerald:{n:'Emerald Alloy',r:'epic',c:0x087a50,a:0x9bffd2,finish:'metal'},
 amethyst:{n:'Amethyst Haze',r:'epic',c:0x6928a8,a:0xf1c4ff,finish:'gloss'},copper:{n:'Burnished Copper',r:'common',c:0x9b542e,a:0xffc28d,finish:'metal'},carbon:{n:'Carbon Weave',r:'rare',c:0x242a35,a:0x8ea1b8,finish:'matte'},
 arctic:{n:'Arctic Camo',r:'rare',c:0xbed8e5,a:0xeffbff,finish:'matte'},sunset:{n:'Afterglow',r:'epic',c:0xf06448,a:0xffd17b,finish:'gloss'},inferno:{n:'Inferno Core',r:'legendary',c:0xc92313,a:0xffb52e,finish:'energy'},
 storm:{n:'Stormglass',r:'epic',c:0x354e71,a:0xb8eaff,finish:'metal'},prism:{n:'Prism Shift',r:'legendary',c:0x784cff,a:0x64ffe0,finish:'energy'},circuit:{n:'Circuit Board',r:'rare',c:0x12483e,a:0x47ffc3,finish:'energy'},
 hologram:{n:'Holographic',r:'legendary',c:0x477ac4,a:0xff8bf2,finish:'energy'},candy:{n:'Candy Coated',r:'common',c:0xe85eaa,a:0xfff0a8,finish:'gloss'},woodland:{n:'Woodland Camo',r:'common',c:0x455b3c,a:0xb5c98b,finish:'matte'},
 desert:{n:'Desert Recon',r:'common',c:0xa77948,a:0xe8d2a1,finish:'matte'},midnight:{n:'Midnight Chrome',r:'epic',c:0x19253c,a:0x8cafff,finish:'metal'},tundra:{n:'Tundra Frost',r:'rare',c:0x628d9d,a:0xd9ffff,finish:'matte'},
 coral:{n:'Coral Reef',r:'rare',c:0xe66d69,a:0xffd3b0,finish:'gloss'},chromatic:{n:'Chromatic Edge',r:'legendary',c:0x3c3b99,a:0xffcf64,finish:'energy'}
};
Object.assign(SKINS,EXTRA_SKINS);

const CR={basic:{n:'Basic Crate',col:'#ff8a1f',cost:100,w:[60,28,10,2]},elite:{n:'Elite Crate',col:'#b45cff',cost:300,w:[0,50,35,15]},legend:{n:'Legendary Crate',col:'#ffb81f',cost:1000,w:[0,0,25,75]}};
const LIM={
 spooky:{n:'Spooky Crate',col:'#ff6a00',cost:500,w:[40,30,20,10],ltd:1},
 og:{n:'OG Crate',col:'#39ff14',cost:500,w:[35,30,25,10],ltd:1},
 easter:{n:'Easter Crate',col:'#ff9acb',cost:650,w:[50,30,15,5],ltd:1},
 popsicle:{n:'Popsicle Crate',col:'#62d9ff',cost:700,w:[45,30,20,5],ltd:1},
 clover:{n:'Clover Crate',col:'#59d88b',cost:750,w:[40,30,20,10],ltd:1},
 christmas:{n:'Christmas Crate',col:'#e34d62',cost:900,w:[30,30,25,15],ltd:1}
};
let limOn={};
const allCR=()=>{const o={...CR};for(const k in LIM){const d=limOn[k];if(d&&d.enabled===true)o[k]={...LIM[k],cost:+d.cost>0?+d.cost:LIM[k].cost}}return o};
async function refreshLim(){try{if(window.cloud&&cloud.user&&cloud.limited){limOn=await cloud.limited();if(!rolling&&(!playing||paused))menu()}}catch(e){console.warn('limited crates',e)}}
let S={coins:250,gems:0,webCredits:0,multiplayerWins:0,multiplayerLosses:0,multiplayerKills:0,multiplayerHeadshots:0,discoveredGuns:['pistol'],indexGemMilestones:0,guns:['pistol'],skins:['default'],gun:'pistol',skin:'default',best:0,kills:0,xp:0,runs:0,sens:1,vol:1,bloom:true,nick:'',hot:['pistol']};

const save=()=>{if(window.cloud&&cloud.user&&!window.tradeLock)cloud.save(S)};
let AC;function beep(f,d,t,v){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'square';o.frequency.value=f;g.gain.value=(v||.04)*(S.vol==null?1:S.vol);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}

/* ---------- menu / shop / locker ---------- */
let tab='play',cu=null,sync='',gateDone=false;
let ev={adminLuck:false};
const cleanNick=s=>String(s||'').replace(/[<>&"'`]/g,'').replace(/\s+/g,' ').trim().slice(0,16);
const shown=()=>S.nick||(cu&&cu.name)||'Player';
let hsel=0;
const cnt=(arr,id)=>{let n=0;for(const x of arr)if(x==id)n++;return n};
let curSlot=-1;
const csz=()=>{try{return +localStorage.getItem('cm_cw')||150}catch(e){return 150}};
function setCw(v){try{localStorage.setItem('cm_cw',v)}catch(e){}applyCw()}
function applyCw(){const v=csz(),g=$('inv');if(g){g.style.setProperty('--cw',v+'px');g.classList.toggle('tiny',v<140)}const r=$('cw');if(r&&+r.value!=v)r.value=v}
function fixHot(h,own){h=(h||[]).slice(0,5);while(h.length<5)h.push('');const used={};return h.map(g=>{if(!g||!GUNS[g])return '';used[g]=(used[g]||0)+1;return used[g]<=cnt(own,g)?g:''})}
const isGemRank=g=>!!(g&&(g.gem||g.rank==='GEM'||g.r==='gem'));
const isSecretGun=g=>!!(g&&(g.secret||g.rank==='SECRET'||g.r==='secret'));
const isAdminGun=g=>!!(g&&(g.admin||g.rank==='ADMIN'));
const isLimitedGun=g=>!!(g&&!isSecretGun(g)&&!isAdminGun(g)&&(g.limited||g.rank==='LIMITED'||g.x));
const rarityLabel=r=>r==='gem'?'GEM':r==='rare'?'rare':String(r||'common').toUpperCase();
const rankKeyOf=g=>isAdminGun(g)?'admin':isSecretGun(g)?'secret':isLimitedGun(g)?'limited':isGemRank(g)?'gem':(R[g&&(g.r||g.rarity)]?(g.r||g.rarity):'common');
const rankScoreOf=g=>RANK_SCORE[rankKeyOf(g)]??0;
const rankLabelOf=g=>rankKeyOf(g)==='gem'?'GEM RANK':rankKeyOf(g)==='admin'?'ADMIN RANK':rankKeyOf(g).toUpperCase();
const rankColorOf=g=>R[rankKeyOf(g)]||R.common;
const gScore=g=>g.d*g.p/Math.max(.001,g.f);
const gunRankScore=g=>rankScoreOf(g);
const gSort=(x,y)=>{const A=GUNS[x],B=GUNS[y];return (gunRankScore(B)-gunRankScore(A))||(gScore(B)-gScore(A))||String(A?.n||x).localeCompare(String(B?.n||y))};
const sSort=(x,y)=>RK.indexOf(SKINS[y].r)-RK.indexOf(SKINS[x].r);
const ST=g=>g&&isSecretGun(g)?'<span class="secrettag">SECRET</span>':'';
const LT=g=>g&&isLimitedGun(g)?'<span class="ltag">LIMITED</span>':'';
const GT=g=>g&&isGemRank(g)?'<span class="gemtag">GEM RANK</span>':'';
const AT=g=>g&&isAdminGun(g)?'<span class="admintag">ADMIN</span>':'';
const rankBadge=g=>isAdminGun(g)?AT(g):isSecretGun(g)?ST(g):isLimitedGun(g)?LT(g):isGemRank(g)?GT(g):`<small>${rankLabelOf(g)}</small>`;
const hexc=c=>'#'+c.toString(16).padStart(6,'0'),lvOf=x=>Math.floor(Math.sqrt((x||0)/60))+1;
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;$('toasts').appendChild(d);setTimeout(()=>d.remove(),2600)}
function feed(t){const d=document.createElement('div');d.textContent=t;$('feed').appendChild(d);setTimeout(()=>d.remove(),1600)}
function setTab(t){tab=t;if(t==='multiplayer'&&window.cmMpOpen)window.cmMpOpen();if(t==='index')indexMilestoneSync();menu();if(t=='crates')refreshLim();if(t=='lb')loadLb();if(t=='gemstore'){loadGemOrders();loadEvents()}if(t=='mail')loadMail();if(t=='crates')loadEvents()}
function showMenu(){$('sub').textContent='Fight the bots. Earn KittyCoins. Crack crates.';menu();$('menu').style.display='flex'}
function closeRs(){$('results').style.display='none'}
function closeRv(){$('reveal').style.display='none';rolling=false;menu()}
function endRun(){if(playing&&paused)over()}
function saveNick(){const v=cleanNick($('o-nick').value);S.nick=v;$('o-nick').value=v;save();menu();toast(v?'Username saved: '+v:'Username cleared - showing your account name')}
function opt(){S.sens=+$('o-sens').value;S.vol=+$('o-vol').value;S.bloom=$('o-bloom').checked;$('v-sens').textContent=S.sens.toFixed(1);save()}
const pixSvg=(id,col)=>{const l=GUNS[id].l,n=Math.round(9+l*7),u=3,r=[];
 const px=(x,y,w,h,f)=>r.push(`<rect x="${x*u}" y="${y*u}" width="${w*u}" height="${h*u}" fill="${f}"/>`);
 const k='#14161d',s=col,lt='#ffffff55';
 px(2,5,n,1,k);px(2,6,n,3,s);px(2,9,n,1,k);px(2,6,n,1,lt); // body
 px(2+n,6,3+Math.round(l*2),1,k);px(2+n,7,3+Math.round(l*2),1,s); // barrel
 px(2,6,2,1,k);px(0,7,2,3,k); // stock
 px(4,10,2,3,k);px(6,13,1,1,k);px(5,9,1,1,s); // grip steps
 px(n-3,10,2,2,k);px(Math.round(n/2),4,2,1,'#38e1ff');px(n,4,1,1,'#38e1ff'); // mag + sights
 return `<svg viewBox="0 0 ${(n+10)*u} ${15*u}" shape-rendering="crispEdges" style="image-rendering:pixelated">${r.join('')}</svg>`};
const gunHash=id=>{let h=2166136261;for(let i=0;i<id.length;i++){h^=id.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
function gunFamily(id,G=GUNS[id]){
 if(G&&['pistol','revolver','smg','rifle','shotgun','sniper','lmg','energy'].includes(G.family))return G.family;
 const s=(id+' '+(G&&G.n||'')).toLowerCase();
 if(/railgun|plasma|blaster|arc |voltaic|zeus|singularity|supernova|obsidian|starfall|chaos engine|game over|final boss/.test(s))return 'energy';
 if(/minigun|lmg|machine gun|cyclone|titan|ironclad|juggernaut|warlord|chaos engine/.test(s))return 'lmg';
 if(G&&G.p>=5)return 'shotgun';
 if(G&&G.d>=60&&G.f>=.35)return 'sniper';
 if(G&&G.a&&G.f<=.095)return G.l>=1.3?'lmg':'smg';
 if(G&&G.a)return 'rifle';
 if(G&&G.l>=1.25)return 'sniper';
 if(/revolver|duelist|deputy|gunslinger|hand cannon|tin star|outlaw/.test(s))return 'revolver';
 return 'pistol';
}
// 500 standard catalogue guns plus separate hidden event-only weapons.
const ACTIVE_GUN_IDS=Object.keys(GUNS);
const eventThemeCounts={};
ACTIVE_GUN_IDS.forEach((id,index)=>{
 const item=GUNS[id];
 const theme=String(item.eventTheme||item.x||'');
 if(theme){
  item.eventTheme=theme;
  if(!Number.isInteger(item.eventStyle)){
   item.eventStyle=eventThemeCounts[theme]||0;
   eventThemeCounts[theme]=(item.eventStyle+1)%5;
  }
 }
 item.family=gunFamily(id,item);
 item.modelDesign=index;
});
if(MAIN_GUN_IDS.length!==500)console.warn('CrateMaster expected 500 standard catalogue guns, found',MAIN_GUN_IDS.length);
if(Object.keys(EVENT_GUNS).length!==43)console.warn('CrateMaster expected 43 event-only guns, found',Object.keys(EVENT_GUNS).length);
const gunSvg=(id,col)=>{
 const G=GUNS[id]||GUNS.pistol,kind=gunFamily(id,G),h=gunHash(id),design=Number.isFinite(G.modelDesign)?G.modelDesign:(Number.isFinite(G.design)?G.design:h);
 const v=design%7,v2=Math.floor(design/7)%11,v3=Math.floor(design/77)%7,v4=Math.floor(design/539)%5;
 const body=col||'#9aa4c4',skin=SKINS[S.skin]||SKINS.default,light=skin.a?hexc(skin.a):`hsl(${(h%360)},85%,72%)`,dark='#101522',steel='#283247';
 if(G.px)return pixSvg(id,body);
 const barrel=(kind==='sniper'?100:kind==='shotgun'?85:kind==='lmg'?72:kind==='energy'?69:kind==='rifle'?68:kind==='smg'?51:kind==='revolver'?36:32)+(v2*4);
 let parts='';
 const r=(x,y,w,hh,fill=body,rx=3,extra='')=>{parts+=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${rx}" fill="${fill}" ${extra}/>`};
 const path=(d,fill=body,extra='')=>{parts+=`<path d="${d}" fill="${fill}" ${extra}/>`};
 const line=(x1,y1,x2,y2,stroke=light,sw=2)=>{parts+=`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`};
 const circle=(cx,cy,rr,fill=steel,stroke=light)=>{parts+=`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`};
 const bx=kind==='sniper'?75:kind==='shotgun'?67:kind==='lmg'?74:kind==='energy'?78:kind==='rifle'?76:kind==='smg'?82:84;
 if(kind!=='pistol'&&kind!=='revolver'){
  const thick=kind==='shotgun'?12:kind==='lmg'?11:kind==='energy'?12:8;
  r(bx,31,barrel,thick,steel,kind==='energy'?6:3);
  r(bx+barrel-10,28,12,thick+6,dark,2);
  line(bx+8,34,bx+barrel-14,34,body,2);
  // Four muzzle profiles: compact crown, brake, suppressor, or flared energy shroud.
  if(v4===0){r(bx+barrel-4,28,13,thick+6,light,2);r(bx+barrel+1,31,5,thick, dark,1)}
  else if(v4===1){r(bx+barrel-14,27,20,thick+8,dark,2);for(let k=0;k<3;k++)line(bx+barrel-11+k*6,30,bx+barrel-8+k*6,39,light,1)}
  else if(v4===2){r(bx+barrel-26,29,27,thick+4,dark,5);r(bx+barrel-25,32,24,3,light,1)}
  else{path(`M${bx+barrel-13} 27 L${bx+barrel+7} 24 L${bx+barrel+7} 47 L${bx+barrel-13} 44 Z`,light);circle(bx+barrel-3,35,4,dark,body)}
  if(kind==='shotgun'){r(77,48,73,5,dark,2);r(87,45,48,3,light,1);for(let i=0;i<5;i++)line(94+i*9,45,94+i*9,51,dark,2)}
  if(kind==='sniper'){r(92,18,54,9,dark,4);r(98,20,42,5,steel,3);circle(99,23,5,dark,light);circle(145,23,5,dark,light);line(119,26,119,31,light,2)}
  if(kind==='lmg'){r(101,18,46,10,dark,4);r(109,14,29,5,body,2);circle(130,23,4,light,dark)}
  if(kind==='energy'){circle(139,36,11,dark,light);circle(139,36,5,light,body);r(151,28,22,16,dark,3);line(155,32,169,32,light,2)}
 }
 if(kind==='pistol'||kind==='revolver'){
  path('M40 29 L111 29 L126 37 L119 49 L46 49 L37 42 Z',body);
  r(44,26,65,5,light,2);r(112,34,20,6,steel,2);r(126,35,8,5,dark,1);
  path('M62 47 L83 48 L77 74 L65 79 L55 71 Z',dark);
  r(64,56,14,15,steel,3);line(66,58,75,70,light,1);
  if(kind==='revolver'){circle(94,49,10,dark,light);circle(94,49,5,steel,body);r(89,55,10,4,light,1)}
 }else{
  const w=(kind==='lmg'?76:kind==='shotgun'?71:kind==='sniper'?66:kind==='energy'?70:kind==='smg'?67:68)*(0.80+v2*.035);
  const x=kind==='sniper'?59:kind==='lmg'?55:kind==='shotgun'?54:kind==='energy'?61:kind==='smg'?66:65;
  if(v===0)path(`M${x} 28 L${x+w-9} 28 L${x+w} 36 L${x+w-5} 51 L${x+4} 51 L${x} 43 Z`,body);
  else if(v===1)path(`M${x+2} 26 L${x+w-14} 26 L${x+w+2} 34 L${x+w-2} 51 L${x+13} 53 L${x-2} 43 Z`,body);
  else if(v===2)path(`M${x} 31 L${x+12} 25 L${x+w-6} 29 L${x+w} 43 L${x+w-8} 52 L${x+2} 50 Z`,body);
  else if(v===3)path(`M${x-2} 29 L${x+w-5} 25 L${x+w+4} 39 L${x+w-3} 50 L${x+7} 54 L${x-5} 43 Z`,body);
  else path(`M${x+4} 27 L${x+w-12} 30 L${x+w+5} 37 L${x+w-10} 53 L${x+1} 49 Z`,body);
  r(x+9,24,w-24,5,light,2);r(x+15,34,w-31,7,steel,2);line(x+16,36,x+w-18,36,light,1);
  // Distinct stock profiles: fixed, folding, skeletal, compact, and precision cheek-rest.
  if(kind!=='energy'){
   if(v2===0)path(`M${x-37} 31 L${x+7} 31 L${x+8} 50 L${x-28} 55 L${x-38} 47 Z`,dark);
   else if(v2===1)path(`M${x-30} 29 L${x+7} 31 L${x+8} 48 L${x-15} 48 L${x-34} 42 Z`,dark);
   else if(v2===2){path(`M${x-35} 31 L${x+8} 31 L${x+5} 37 L${x-12} 39 L${x-29} 53 L${x-39} 47 Z`,dark);line(x-28,40,x-12,47,light,2)}
   else if(v2===3)path(`M${x-23} 33 L${x+8} 31 L${x+7} 49 L${x-17} 51 L${x-26} 44 Z`,dark);
   else path(`M${x-39} 25 L${x+7} 29 L${x+9} 50 L${x-32} 52 L${x-42} 43 Z`,dark);
  }
  // Four magazine silhouettes: straight, curved, drum, box and extended.
  if(kind==='lmg'||v3===2){path(`M${x+21} 49 L${x+57} 49 L${x+66} 60 Q${x+60} 82 ${x+35} 82 Q${x+14} 73 ${x+21} 49 Z`,dark);circle(x+42,65,11,steel,light);circle(x+42,65,5,dark,body)}
  else if(v3===1){path(`M${x+24} 49 L${x+45} 49 L${x+41} 70 L${x+33} 79 L${x+25} 72 Z`,dark);line(x+29,57,x+39,69,light,2)}
  else if(v3===3){r(x+22,50,29,26,dark,5);r(x+26,53,21,20,steel,3);line(x+28,57,x+45,57,light,1)}
  else{path(`M${x+24} 49 L${x+43} 49 L${x+40} ${kind==='sniper'?81:75} L${x+29} ${kind==='sniper'?83:79} Z`,dark);r(x+27,58,11,16,steel,2);line(x+30,60,x+35,73,light,1)}
  // Optics differ by design: ring scope, holographic window, raised dot, or open iron sights.
  if(kind==='sniper'||v4===2){r(x+22,15,42,10,dark,4);r(x+28,17,28,6,steel,3);circle(x+27,20,5,dark,light);circle(x+60,20,5,dark,light);line(x+43,25,x+43,29,light,2)}
  else if(v4===1){r(x+26,17,31,12,dark,4);r(x+30,19,23,7,'#68dfff',2);line(x+41,20,x+41,26,'#ffffff',1)}
  else if(v4===3){circle(x+40,20,6,dark,light);circle(x+40,20,2,light,body);r(x+35,25,10,4,steel,1)}
  else{r(x+29,18,22,8,dark,2);r(x+36,14,8,5,steel,1);line(x+40,18,x+40,24,light,2)}
  for(let i=0;i<2+(v%4);i++){const xx=x+12+i*9;r(xx,40,4,2,i%2?light:dark,1)}
  if(v%2===0){path(`M${x+8} 29 L${x+22} 29 L${x+17} 34 L${x+8} 34 Z`,light)}else circle(x+w-15,42,3,light,dark);
  if(kind==='energy'){for(let i=0;i<3;i++){r(x+14+i*11,54,5,3,light,1);line(x+16+i*11,53,x+16+i*11,60,body,1)}}
 }
 // Unique rail, front grip and serial plate details on every generated design profile.
 if(kind==='smg'||kind==='rifle'||kind==='lmg'){r(20,33,kind==='lmg'?34:27,5,dark,2);line(24,35,43,35,light,1)}
 if(kind==='pistol'||kind==='revolver')r(47,21,34,4,dark,1);
 if(design%3===0){r(92,54,18,5,light,2);line(95,55,106,55,dark,1)}
 else if(design%3===1){path('M96 55 L119 53 L115 61 L99 62 Z',steel);line(100,57,113,56,light,1)}
 else{circle(105,57,5,light,dark);circle(105,57,2,dark,body)}
 for(let i=0;i<1+(design%4);i++)line(30+i*7,47,35+i*7,50,i%2?light:dark,1);
 circle(47+(h%90),43,2,light,dark);
 return `<svg viewBox="0 0 220 90" role="img" aria-label="Weapon design" xmlns="http://www.w3.org/2000/svg"><g>${parts}</g><path d="M14 83 H205" stroke="#ffffff18" stroke-width="1"/></svg>`;
};
const gunArt=id=>{
 const g=GUNS[id]||GUNS.pistol,skinId=SKINS[S.skin]?S.skin:'default',skin=SKINS[skinId]||SKINS.default;
 const safeName=String(g.n||id).replace(/[&<>"']/g,'');
 const safeId=String(GUNS[id]?id:'pistol').replace(/[^a-z0-9_-]/gi,'');
 // This is a canvas rendered from the exact same Three.js model recipe used by
 // the in-game viewmodel. No per-weapon PNG file or images/guns directory is used.
 return `<span class="gun-art-wrap weapon-3d-preview" title="${safeName} 3D preview"><canvas class="weapon-3d-canvas" width="240" height="110" data-gun-preview="${safeId}" data-skin-preview="${skinId}" aria-label="${safeName} 3D model preview"></canvas><span class="weapon-3d-fallback" hidden>${gunSvg(safeId,hexc(skin.c||0x777b88))}</span></span>`;
};
const stat=(n,v)=>`<div class="bar"><em>${n}</em><i><u style="width:${Math.max(4,Math.min(100,v))}%"></u></i></div>`;

// Collection boost unlocks after discovering any 500 distinct catalogue guns.
// Normal, GEM, LIMITED and SECRET discoveries all count; duplicates do not.
function collectionBoostUnlocked(){
 const found=new Set((S.discoveredGuns||[]).filter(id=>Object.prototype.hasOwnProperty.call(GUNS,id)));
 return found.size>=500;
}
// The server owns discovery rewards and KittyGems. These helpers only update local display state.
function indexMilestoneSync(){return 0;}
function discoverGun(id){if(!GUNS[id])return 0;const set=new Set(S.discoveredGuns||[]);const before=set.size;set.add(id);S.discoveredGuns=[...set];return set.size>before?0:0;}
function tryCollectionDropGem(){return false;}

const menuCache={crates:null,hotl:null,inv:null,skins:null,index:null,gemstore:null};
let inventoryPage=0,inventorySignature='';
function showMoreGuns(){inventoryPage++;menuCache.inv=null;renderLockerCards()}
function ownedBeforeSnapshot(){return {guns:new Set(S.discoveredGuns||S.guns||[]),skins:new Set(S.skins||[])}}
function isNewReward(item,snapshot){if(!snapshot||!item)return false;return item.type==='skins'?!snapshot.skins.has(item.id):!snapshot.guns.has(item.id)}
function renderCrateCards(){
 const data=allCR(),adminOn=adminCrateAvailable(),key=JSON.stringify([data,ev.adminLuck,adminOn,adminOn?Number(S.adminKeys||0):0]);
 if(menuCache.crates===key)return;
 menuCache.crates=key;
 const card=([k,c])=>{
  const W=ev.adminLuck?boostW(c.w):c.w;
  return `<article class="crate ${c.ltd?'ltd':''}" style="--c:${c.col}">${c.ltd?'<span class="tag">LIMITED</span>':''}<div class="cbox"></div><b>${c.n}</b><div class="odds">${RK.map((r,i)=>W[i]?`<div><span style="color:${R[r]}">${r}</span><i><u style="width:${W[i]}%;background:${R[r]}"></u></i><em>${W[i]}%</em></div>`:'').join('')}</div>${c.ltd?'<small class="hidden-event-note">Secret event rewards are separate from the standard rarity display.</small>':''}<div class="cbtns"><button class="big" onclick="openCrate('${k}')">OPEN · <i class="coin"></i>${c.cost}</button><button class="big ten" onclick="openTen('${k}')">OPEN 10 · <i class="coin"></i>${c.cost*10}</button><button class="big hund" onclick="openHundred('${k}')">OPEN 100 · <i class="coin"></i>${c.cost*100}</button></div></article>`;
 };
 const entries=Object.entries(data),normal=entries.filter(([,c])=>!c.ltd),limited=entries.filter(([,c])=>!!c.ltd);
 const group=(title,sub,items,kind)=>`<section class="crate-group ${kind}"><div class="crate-group-head"><div><span class="crate-group-eyebrow">CRATEMASTER DROP COLLECTION</span><h3>${title}</h3><p>${sub}</p></div><span class="crate-group-count">${items.length} ${items.length===1?'CRATE':'CRATES'}</span></div><div class="crate-grid">${items.map(card).join('')||'<div class="crate-group-empty">No Limited Crates are currently available. Check back when an event goes live.</div>'}</div></section>`;
 $('crates').innerHTML=(ev.adminLuck?'<div class="ev-banner">⚡ <b>ADMIN LUCK EVENT</b> · Secret weapons 0.5% · Limited chance 3% · Legendary odds +30%</div>':'')+(adminOn?adminCrateCard():'')+group('NORMAL CRATES','Standard crates with regular KittyCoins drops.',normal,'normal')+group('LIMITED CRATES','Event and time-limited collections. These crates appear only while enabled.',limited,'limited');
}
function renderLockerCards(){
 S.hot=fixHot(S.hot,S.guns);
 const hotKey=JSON.stringify([S.hot,hsel]);
 if(menuCache.hotl!==hotKey){
  menuCache.hotl=hotKey;
  $('hotl').innerHTML=S.hot.map((g,i)=>{const G=GUNS[g];return `<div class="hs ${hsel==i?'sel':''}" style="--c:${G?rankColorOf(G):'#555'}" onclick="hset(${i})"><em>${i+1}</em>${G?`<b>${G.n}</b>${rankBadge(G)}<button class="x" onclick="event.stopPropagation();hclr(${i})">✕</button>`:'<small>empty</small>'}</div>`}).join('');
 }
 const currentInvSignature=JSON.stringify([S.guns,S.hot,S.gun,S.skin,csz(),hsel]);
 if(currentInvSignature!==inventorySignature){inventorySignature=currentInvSignature;inventoryPage=0;menuCache.inv=null}
 const invKey=JSON.stringify([currentInvSignature,inventoryPage]);
 if(menuCache.inv!==invKey){
  menuCache.inv=invKey;
  const sk=hexc(SKINS[S.skin].c),grp={};S.guns.forEach(id=>{if(GUNS[id])grp[id]=(grp[id]||0)+1});
  const ids=Object.keys(grp).sort(gSort),pageSize=60,visible=ids.slice(0,(inventoryPage+1)*pageSize);
  $('inv').innerHTML=visible.map(id=>{const G=GUNS[id],n=grp[id],hs=S.hot.map((g,i)=>g==id?i+1:0).filter(Boolean);return `<div class="wcard ${S.gun==id?'on':''}" style="--c:${rankColorOf(G)}">${n>1?`<i class="cnt">×${n}</i>`:''}${gunArt(id)}<b>${G.n}</b>${rankBadge(G)}<div class="bars">${stat('DMG',G.d*G.p*.9)}${stat('RATE',10/G.f)}${stat('ACC',100-G.s*600)}</div><button onclick="eq('guns','${id}')">${S.gun==id?'Equipped':'Equip'}</button><button class="ghost" onclick="toSlot('${id}')">${hs.length?'Slot '+hs.join(',')+' · '+(hs.includes(hsel+1)?'in '+(hsel+1):(hs.length<n?'add to ':'move to ')+(hsel+1)):'Put in slot '+(hsel+1)}</button>${id==='pistol'?'':'<button class="sell-button" onclick="openSell(\'guns\',\''+id+'\')">SELL FOR KITTYCOINS</button>'}</div>`}).join('');
  let pager=$('inv-pager');if(!pager){pager=document.createElement('div');pager.id='inv-pager';pager.className='inv-pager';$('inv').insertAdjacentElement('afterend',pager)}
  pager.innerHTML=visible.length<ids.length?`<span>Showing ${visible.length} of ${ids.length} owned weapons</span><button class="sm" onclick="showMoreGuns()">SHOW ${Math.min(pageSize,ids.length-visible.length)} MORE <span>(${ids.length-visible.length} left)</span></button>`:`<span>Showing all ${ids.length} owned weapons</span>`;
  applyCw();
 }
 const skinsKey=JSON.stringify([S.skins,S.skin]);
 if(menuCache.skins!==skinsKey){
  menuCache.skins=skinsKey;
  $('skins').innerHTML=[...new Set(S.skins)].filter(id=>SKINS[id]).sort(sSort).map(id=>{const K=SKINS[id],n=cnt(S.skins,id);return `<div class="skin-card"><button class="sw2 ${S.skin==id?'on':''}" style="--c:${R[K.r]}" onclick="eq('skins','${id}')"><span style="background:linear-gradient(135deg,${hexc(K.c)},${hexc(K.a||K.c)} 58%,#111827 150%)"></span>${K.n}${n>1?' ×'+n:''}<small>${K.r}</small></button>${id==='default'?'':`<button class="sell-button" onclick="openSell('skins','${id}')">SELL</button>`}</div>`}).join('');
 }
}

let sellPending=null;
const SELL_VALUES={guns:{common:5,rare:12,epic:30,legendary:75,gem:180},skins:{common:2,rare:5,epic:12,legendary:25}};
function sellUnitValue(type,id){const item=(type==='guns'?GUNS:SKINS)[id];if(!item)return 0;if(type==='guns'&&isAdminGun(item))return 1000;if(type==='guns'&&isSecretGun(item))return 500;if(type==='guns'&&isLimitedGun(item))return 100;if(type==='guns'&&isGemRank(item))return 200;return (SELL_VALUES[type]||{})[item.r]||5}
function closeSell(){sellPending=null;$('sell-modal').style.display='none'}
function openSell(type,id){
 if(rolling||window.tradeLock){toast('Finish the current action first');return;}
 const dict=type==='guns'?GUNS:SKINS,item=dict[id],owned=type==='guns'?S.guns:S.skins,count=cnt(owned,id);
 if(!item||!count||id==='pistol'||id==='default'){toast('That item cannot be sold');return;}
 const unit=sellUnitValue(type,id),protectedItem=type==='guns'&&(isLimitedGun(item)||isSecretGun(item)||isAdminGun(item));
 sellPending={type,id,name:item.n,unit,limited:protectedItem,count};
 const action=(qty,label)=>`<button class=\"sell-choice\" onclick=\"confirmSell(${qty})\"><span>${label}</span><b>+${(unit*qty).toLocaleString()} KittyCoins</b></button>`;
 $('sell-body').innerHTML=`<div class=\"sell-eyebrow\">KITTYCOINS EXCHANGE</div><h2>Sell ${item.n}</h2><p>You own <b>${count}</b> ${type==='guns'?'copies':'copies'} · ${unit} KittyCoins per copy.</p><div class=\"sell-options\">${action(1,'Sell 1')}${count>1?action(count-1,'Sell extras — keep 1'):''}${count>1?action(count,'Sell all'):''}</div>${protectedItem?`<div class=\"sell-limited-warning\"><b>LIMITED ITEM</b><span>To prevent accidental sales, type the exact item name below:</span><input id=\"sell-name-confirm\" autocomplete=\"off\" placeholder=\"${item.n}\"></div>`:''}<button class=\"sell-cancel\" onclick=\"closeSell()\">CANCEL</button>`;
 $('sell-modal').style.display='flex';
}
async function confirmSell(qty){
 const p=sellPending;if(!p)return;qty=Math.floor(Number(qty)||0);if(qty<1||qty>p.count)return;
 if(p.limited){const typed=($('sell-name-confirm')?.value||'').trim();if(typed!==p.name){toast('The name does not match. Special item sale cancelled.');return;}}
 if(!cloud||!cu){toast('Sign in first');return;}
 const btns=$('sell-body').querySelectorAll('button');btns.forEach(b=>b.disabled=true);
 try{
  const result=await cloud.action('/api/economy/sell',{type:p.type,id:p.id,quantity:qty,typedName:p.limited?($('sell-name-confirm')?.value||'').trim():''});
  applyServerPlayer(result.player);closeSell();menu();renderIndex();toast(`Sold ${qty} × ${p.name} for ${Number(result.coinsEarned||0).toLocaleString()} KittyCoins`);
 }catch(e){btns.forEach(b=>b.disabled=false);toast(e.message||'Sale failed');}
}
let indexFilter='all',indexSearch='',indexPage=0;
const indexEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setIndexFilter(f){indexFilter=f;indexPage=0;renderIndex()}
function searchIndex(v){indexSearch=String(v||'').trim().toLowerCase();indexPage=0;renderIndex()}
function showMoreIndex(){indexPage++;renderIndex()}
async function refreshIndex(){try{if(cloud&&cu){const result=await cloud.bootstrap();applyServerPlayer(result.player);}indexMilestoneSync();renderIndex();updateWallet();toast(collectionBoostUnlocked()?'Collection boost active · 5% KittyGem bonus chance':'Index refreshed');}catch(e){toast(e.message||'Could not refresh Index from the server');}}
function renderIndex(){
 const found=new Set((S.discoveredGuns||[]).filter(id=>Object.prototype.hasOwnProperty.call(GUNS,id)));
 // Undiscovered Limited and Secret weapons are deliberately absent, not shown as question-mark cards.
 const visibleIds=ACTIVE_GUN_IDS.filter(id=>{const g=GUNS[id];return !(isLimitedGun(g)||isSecretGun(g)||isAdminGun(g))||found.has(id)});
 const all=visibleIds.map(id=>[id,GUNS[id]]),complete=found.size>=500;
 const discovered=found.size,boostProgress=Math.min(discovered,500),next=(Math.floor(found.size/10)+1)*10,progress=(found.size%10)*10;
 $('index-summary').innerHTML=`<div class="index-summary-card"><span>WEAPONS DISCOVERED</span><b>${discovered.toLocaleString()}</b><small>Unique weapons registered in your Index</small></div><div class="index-summary-card"><span>COLLECTION BOOST</span><b>${boostProgress}/500</b><small>${complete?'5% KittyGem bonus chance active on eligible drops':'Discover '+Math.max(0,500-discovered)+' more unique weapons to unlock the 5% KittyGem bonus'}</small></div><div class="index-summary-card"><span>NEXT GEM MILESTONE</span><b>${Math.max(0,next-found.size)} guns to go</b><i><u class="gem-progress" style="width:${progress}%"></u></i><small>Every 10 discoveries = 10 KittyGems · Balance: ${Number(S.gems||0).toLocaleString()}</small></div>`;
 const filters=[['all','All'],['normal','Normal'],['limited','Limited'],['secret','Secret'],['gem','GEM rank'],['found','Discovered']];
 $('index-filters').innerHTML=filters.map(([v,n])=>`<button class="index-filter ${indexFilter===v?'on':''}" onclick="setIndexFilter('${v}')">${n}</button>`).join('');
 let entries=all.filter(([id,g])=>{
  const isFound=found.has(id),isNormal=!isLimitedGun(g)&&!isSecretGun(g)&&!isGemRank(g)&&!isAdminGun(g);
  if(indexFilter==='normal'&&!isNormal)return false;
  if(indexFilter==='limited'&&!isLimitedGun(g))return false;
  if(indexFilter==='secret'&&!isSecretGun(g))return false;
  if(indexFilter==='gem'&&!isGemRank(g))return false;
  if(indexFilter==='found'&&!isFound)return false;
  return !indexSearch||String(g.n||'').toLowerCase().includes(indexSearch)||id.toLowerCase().includes(indexSearch);
 }).sort((a,b)=>gSort(a[0],b[0]));
 const size=60,visible=entries.slice(0,(indexPage+1)*size);
 $('index-grid').innerHTML=visible.map(([id,g])=>{
  const isFound=found.has(id),owned=cnt(S.guns,id),tone=rankColorOf(g);
  return `<article class="index-card ${isFound?'discovered':'undiscovered'}" style="--c:${tone}"><div class="index-art">${isFound?gunArt(id):'<span class="index-question">?</span>'}</div><b>${isFound?indexEscape(g.n):'???'}</b><div class="index-tags">${rankBadge(g)}</div><em>${isFound?(owned?'OWNED ×'+owned:'DISCOVERED'):'NOT DISCOVERED'}</em></article>`;
 }).join('')||'<p class="index-empty">No weapons match this Index filter.</p>';
 $('index-pager').innerHTML=visible.length<entries.length?'<button class="sm" onclick="showMoreIndex()">SHOW MORE</button>':'<span>END OF VISIBLE INDEX</span>';
 $('index-buff').classList.toggle('complete',complete);
 $('index-buff').innerHTML=complete?`<b>✦ COLLECTION BOOST ACTIVE · ${boostProgress}/500</b><span>You have discovered enough unique weapons. Eligible Legendary, LIMITED, SECRET and GEM-rank gun drops now have a 5% chance to grant +1 KittyGem.</span>`:`<b>COLLECTION BOOST · ${boostProgress}/500</b><span>Discover ${Math.max(0,500-discovered)} more unique weapons. Any combination of normal, GEM, LIMITED and SECRET guns counts toward unlocking the 5% KittyGem bonus on eligible drops.</span>`;
}
function renderGemOdds(){
 const base={common:50,rare:25,epic:15,legendary:8,gem:2},t={...base};if(ev.adminLuck)t.legendary*=1.3;
 const sum=Object.values(t).reduce((a,b)=>a+b,0);
 for(const k in t){const el=$('go-'+k);if(el)el.textContent=(Math.round(t[k]/sum*1000)/10)+'%'}
 const b=$('ev-banner-gem');if(b)b.style.display=ev.adminLuck?'block':'none';
}
function renderGemStore(){
 const balance=Number(S.gems||0);
 $('gemstore-balance').textContent=balance.toLocaleString();
 const options=[['open-gem-crate',1,'OPEN 1 · 25 GEMS'],['open-gem-crate-10',10,'OPEN 10 · 250 GEMS'],['open-gem-crate-100',100,'OPEN 100 · 2,500 GEMS']];
 renderGemOdds();
 for(const [id,quantity,label] of options){const b=$(id);if(b){b.disabled=rolling||balance<25*quantity;if(!rolling)b.textContent=label;}}
}
// ---- Events, Admin Crate (needs the AdminLuck event + at least 1 Admin Key) ----
const boostW=w=>{const t=w.map((v,i)=>i===3?v*1.3:v),sum=t.reduce((a,b)=>a+b,0)||1;return t.map(v=>Math.round(v/sum*1000)/10)};
const adminCrateAvailable=()=>!!(ev&&ev.adminLuck)&&Number(S.adminKeys||0)>=1;
const ADMIN_ODDS=[['epic',35],['legendary',60],['gem',3],['admin',2]];
function adminCrateCard(){
 const keys=Number(S.adminKeys||0),btn=(q,cls)=>`<button class="big ${cls}" ${keys<q?'disabled':''} onclick="openAdminCrate(${q})">OPEN ${q>1?q+' · ':'· '}${q} KEY${q>1?'S':''}</button>`;
 return `<section class="crate-group admin"><div class="crate-group-head"><div><span class="crate-group-eyebrow">ADMIN ACCESS</span><h3>ADMIN CRATE</h3><p>Opens with Admin Keys while the Admin Luck event is live.</p></div><span class="crate-group-count">${keys} KEY${keys===1?'':'S'}</span></div><div class="crate-grid"><article class="crate ltd admincrate" style="--c:${R.admin}"><span class="tag admin-tag">ADMIN</span><div class="cbox"></div><b>Admin Crate</b><div class="odds">${ADMIN_ODDS.map(([r,v])=>`<div><span style="color:${R[r]}">${r==='gem'?'GEM RANK':r==='admin'?'ADMIN RANK':r}</span><i><u style="width:${v}%;background:${R[r]}"></u></i><em>${v}%</em></div>`).join('')}</div><div class="cbtns">${btn(1,'')}${btn(10,'ten')}${btn(100,'hund')}</div></article></div></section>`;
}
const adminVisualRarity=()=>{const n=Math.random()*100;return n<35?'epic':n<95?'legendary':n<98?'gem':'admin'};
async function openAdminCrate(quantity=1){
 quantity=Math.floor(Number(quantity)||0);
 if(![1,10,100].includes(quantity))return;
 if(rolling||window.tradeLock){toast('Finish the current action first');return}
 if(!cu||!cloud){toast('Sign in first');return}
 if(Number(S.adminKeys||0)<quantity){toast('Not enough Admin Keys');return}
 if(quantity>1&&!confirm(`Open ${quantity} Admin Crates using ${quantity} Admin Keys?`))return;
 const ownedBefore=ownedBeforeSnapshot();rolling=true;
 try{
  const [result]=await Promise.all([cloud.action('/api/economy/open-admin-crate',{quantity}),waitMs(quantity===100?850:650)]);
  applyServerPlayer(result.player);
  const awarded=Array.isArray(result.items)?result.items:[];
  if(awarded.length!==quantity)throw new Error('The server returned an incomplete Admin Crate result. Refresh and check your inventory.');
  menuCache.crates=null;
  await animateGemCrateRoll(quantity,awarded,result.rewards||{},ownedBefore,{name:'ADMIN CRATE',visual:adminVisualRarity});
  updateWallet();menu();
 }catch(e){rolling=false;menuCache.crates=null;menu();toast(e.message||'Admin Crate failed to open')}
}
async function loadEvents(){
 try{
  if(!cloud||!cu)return;
  const res=await cloud.action('/api/events'),next=res.events||{adminLuck:false};
  if(JSON.stringify(next)!==JSON.stringify(ev)){ev=next;menuCache.crates=null;if(!rolling&&(!playing||paused))menu()}
 }catch(e){console.warn('events',e)}
}
async function buyGemGun(){toast('Individual purchases are disabled. Open the KittyGem Crate instead.');}
// ---- Buying KittyGems with Tikkie (orders are created and approved server-side) ----
let gemOrders=null,gemOrdersBusy=false;
const gemOrderDate=ms=>new Date(ms).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
function renderGemOrders(){
 const box=$('gem-orders');if(!box)return;
 if(!cu){box.innerHTML='<p class="note">Sign in to buy KittyGems.</p>';return}
 if(!gemOrders){box.innerHTML='<p class="note">Loading…</p>';return}
 if(!gemOrders.length){box.innerHTML='<p class="note">No orders yet.</p>';return}
 const label={pending:'PENDING',approved:'PENDING',completed:'COMPLETED',rejected:'REJECTED'};
 box.innerHTML=gemOrders.map(o=>{
  const st=o.status==='approved'?'pending':o.status;
  const extra=st==='pending'
   ?`<small>Waiting for approval · credited automatically on ${gemOrderDate(o.autoAtMs)} at the latest</small>${o.tikkieUrl?`<a class="gemorder-pay" href="${gemRollEsc(o.tikkieUrl)}" target="_blank" rel="noopener noreferrer">Open Tikkie to pay €${gemRollEsc(o.euro)}</a>`:''}`
   :st==='completed'?`<small>+${Number(o.gems).toLocaleString()} KittyGems added to your account</small>`:'<small>This order was not approved. Contact support if you already paid.</small>';
  return `<div class="gemorder gemorder-${st}"><div class="gemorder-top"><b>${gemRollEsc(o.code)}</b><span class="gemorder-badge">${label[o.status]||gemRollEsc(o.status)}</span></div><div class="gemorder-line">${Number(o.gems).toLocaleString()} gems · €${gemRollEsc(o.euro)} · ${gemOrderDate(o.createdAtMs)}</div>${extra}</div>`;
 }).join('');
}
function applyGemOrdersResult(res,announce){
 if(!res)return;
 const before=new Map((gemOrders||[]).map(o=>[o.id,o.status==='approved'?'pending':o.status]));
 gemOrders=res.orders||[];
 if(announce)for(const o of gemOrders)if(o.status==='completed'&&before.get(o.id)==='pending')toast(`Order ${o.code} approved · +${Number(o.gems).toLocaleString()} KittyGems`);
 if(res.player)applyServerPlayer(res.player);
 renderGemOrders();
}
async function loadGemOrders(announce=false){
 if(!cloud||!cu||gemOrdersBusy)return renderGemOrders();
 gemOrdersBusy=true;
 try{applyGemOrdersResult(await cloud.action('/api/gems/orders'),announce)}
 catch(e){const box=$('gem-orders');if(box&&!gemOrders)box.innerHTML='<p class="note">Could not load your orders. '+gemRollEsc(e.message||'')+'</p>'}
 finally{gemOrdersBusy=false}
}
async function buyGemPack(){
 if(!cloud||!cu){toast('Sign in first');return}
 const input=$('gem-payer'),btn=$('gem-buy'),name=(input.value||'').trim();
 if(name.length<2){toast('Enter the name you will pay with');input.focus();return}
 btn.disabled=true;btn.textContent='PLACING ORDER…';
 try{
  const res=await cloud.action('/api/gems/order',{payerName:name});
  applyGemOrdersResult(res,false);
  try{localStorage.setItem('cm-payer',name)}catch(e){}
  toast(`Order ${res.created.code} placed · now pay the Tikkie link below`);
 }catch(e){toast(e.message||'Could not place the order')}
 finally{btn.disabled=false;btn.textContent='BUY 200 GEMS · €2'}
}
setInterval(()=>{if(tab==='gemstore'&&!document.hidden&&cu&&!playing)loadGemOrders(true)},30000);
addEventListener('DOMContentLoaded',()=>{try{const v=localStorage.getItem('cm-payer');const i=$('gem-payer');if(v&&i&&!i.value)i.value=v}catch(e){}});

const waitMs=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function gemVisualRarity(){
 // Decorative filler only. The winning rarity/item always comes from the server response.
 const n=Math.random()*100;
 return n<50?'common':n<75?'rare':n<90?'epic':n<98?'legendary':'gem';
}
const gemRollEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function gemRollWinnerMarkup(item,small=false){
 const itemName=item.name||GUNS[item.id]?.n||item.id||'Mystery drop';
 const weaponArt=GUNS[item.id]?gunArt(item.id):'<b>★</b>';
 return `${weaponArt}<small>${gemRollEsc(itemName)}</small><em>${rankLabelOf(item)}</em>`;
}
function gemRollCardMarkup(rarity){
 return `<div class="rc" style="--c:${R[rarity]||R.common}"><b>?</b><small>${String(rarity).toUpperCase()}</small></div>`;
}
function animateGemCrateRoll(quantity,items,rewards={},ownedBefore=null,opts={}){
 const crateName=opts.name||'KITTYGEM CRATE',visual=opts.visual||gemVisualRarity;
 return new Promise(resolve=>{
  const rv=$('reveal');
  const size=quantity===1?'single':quantity===10?'ten':'hundred';
  const winIndex=size==='single'?54:size==='ten'?54:16;
  const count=size==='single'||size==='ten'?64:22;
  const step=size==='single'?140:size==='ten'?84:46;
  const duration=size==='single'?6500:size==='ten'?5400:4200;
  const center=size==='single'?65:size==='ten'?39:21;
  const rollClass=size==='single'?'':size==='ten'?'mini':'mega';
  const title=quantity===1?`OPENING ${crateName}`:`OPENING ${crateName}S ×${quantity}`;
  const stripsHtml=size==='single'?'':items.map((item,i)=>{
   const cards=Array.from({length:count},()=>visual());
   cards[winIndex]=item.rarity|| (item.gem?'gem':'common');
   const markup=cards.map(gemRollCardMarkup).join('');
   return `<div class="roll ${rollClass}" aria-label="Gem Crate roll ${i+1}"><div class="marker"></div><div class="strip" id="gem-roll-strip-${i}">${markup}</div></div>`;
  }).join('');
  if(size==='single'){
   rv.innerHTML=`<div class="rtitle">${title}</div><div class="roll gem-roll-single"><div class="marker"></div><div class="strip" id="gem-roll-strip-0"></div></div><button class="link" id="gem-roll-skip">Skip</button>`;
   // For the single reel, keep the cards directly inside its strip (no nested reel wrapper).
   const strip=$('gem-roll-strip-0');
   const cards=Array.from({length:count},()=>visual());
   cards[winIndex]=items[0].rarity||(items[0].gem?'gem':'common');
   strip.innerHTML=cards.map(gemRollCardMarkup).join('');
  } else {
   const gridClass=size==='ten'?'rolls10':'rolls100';
   rv.innerHTML=`<div class="r10wrap gem-roll-batch ${size==='hundred'?'gem-roll-hundred':''}"><div class="rtitle">${title}</div><div class="${gridClass}">${stripsHtml}</div><button class="link" id="gem-roll-skip">Skip</button></div>`;
  }
  rv.style.display='flex';rv.className='r-gem gem-roll-screen';

  const strips=items.map((_,i)=>$('gem-roll-strip-'+i));
  const viewWidths=strips.map(s=>s.parentElement.clientWidth);
  const distances=viewWidths.map(w=>winIndex*step+center-w/2);
  const finished=new Array(items.length).fill(false);
  let finishedCount=0,allFinished=false,raf=0,lastTick=-1;
  const safeX=el=>{
   const transform=getComputedStyle(el).transform;
   if(!transform||transform==='none')return 0;
   try{return new DOMMatrixReadOnly(transform).m41}catch(_){
    const m=transform.match(/^matrix\(([^)]+)\)$/);return m?Number(m[1].split(',')[4])||0:0;
   }
  };
  const finishOne=(i,skip=false)=>{
   if(finished[i])return;
   finished[i]=true;
   const strip=strips[i],item=items[i];
   if(skip){strip.style.transition='none';strip.style.transform=`translateX(${-distances[i]}px)`}
   const winner=strip.children[winIndex];
   if(winner){
    const winningRank=rankKeyOf(item);
    winner.style.setProperty('--c',rankColorOf(item));
    winner.dataset.rank=winningRank;
    winner.classList.add('win',`rank-${winningRank}`);
    winner.innerHTML=gemRollWinnerMarkup(item,size==='hundred');
    winner.title=`${rankLabelOf(item)} · ${item.name||item.id||''}`;
   }
   strip.classList.add('done');
   finishedCount++;
   if(finishedCount===items.length&&!allFinished){
    allFinished=true;cancelAnimationFrame(raf);
    const skipButton=$('gem-roll-skip');if(skipButton)skipButton.remove();
    const bestItem=items.reduce((bestItem,item)=>rankScoreOf(item)>rankScoreOf(bestItem)?item:bestItem,items[0]);
    const best=rankKeyOf(bestItem||{r:'common'});
    rv.className=`r-${best} gem-roll-screen hit`;
    beep(best==='admin'?1500:best==='secret'?1320:best==='limited'?1120:best==='gem'?980:best==='legendary'?880:best==='epic'?660:440,.5,'triangle',.09);
    setTimeout(()=>{
     renderSecureReveal(`${crateName} ×${quantity}`,items,rewards,ownedBefore);
     resolve();
    },size==='hundred'?700:950);
   }
  };
  const tick=()=>{
   if(allFinished)return;
   try{
    const x=-safeX(strips[0]),current=Math.floor((x+viewWidths[0]/2)/step);
    if(current!==lastTick){lastTick=current;beep(260+(current%5)*25,.025,'square',.022)}
   }catch(_){ }
   raf=requestAnimationFrame(tick);
  };
  const skipAll=()=>strips.forEach((_,i)=>finishOne(i,true));
  const skipButton=$('gem-roll-skip');if(skipButton)skipButton.onclick=skipAll;
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){setTimeout(skipAll,180);return;}
  // Trigger layout before starting CSS transitions so every reel rolls from the same resting position.
  strips.forEach(s=>{s.style.transform='translateX(0px)';void s.offsetWidth;});
  setTimeout(()=>{
   strips.forEach((strip,i)=>{
    const extra=size==='ten'?i*125:size==='hundred'?(i%10)*16:0;
    const ms=duration+extra;
    strip.style.transition=`transform ${ms}ms cubic-bezier(.08,.6,.12,1)`;
    strip.style.transform=`translateX(${-distances[i]}px)`;
    strip.addEventListener('transitionend',e=>{if(e.target===strip)finishOne(i,false)},{once:true});
    setTimeout(()=>finishOne(i,false),ms+450);
   });
   tick();
  },70);
 });
}
async function openGemCrate(quantity=1){
 quantity=Math.floor(Number(quantity)||0);
 if(![1,10,100].includes(quantity)){toast('Choose 1, 10 or 100 Gem Crates');return;}
 if(rolling||window.tradeLock){toast('Finish the current action first');return;}
 if(!cu||!cloud){toast('Sign in first');return;}
 const totalCost=25*quantity;
 if(Number(S.gems||0)<totalCost){toast(`You need ${totalCost.toLocaleString()} KittyGems to open ${quantity} Gem Crate${quantity===1?'':'s'}`);return;}
 if(quantity>1&&!confirm(`Open ${quantity} KittyGem Crates for ${totalCost.toLocaleString()} KittyGems?`))return;
 const ownedBefore=ownedBeforeSnapshot();
 rolling=true;
 const showcase=document.querySelector('.gemcrate-showcase');
 if(showcase)showcase.classList.add('is-opening');
 renderGemStore();
 const buttons=['open-gem-crate','open-gem-crate-10','open-gem-crate-100'].map($);
 buttons.forEach(b=>{if(b)b.disabled=true});
 try{
  // The server decides and awards the drops first. The client only animates those verified results.
  const [result]=await Promise.all([
   cloud.action('/api/economy/open-gem-crate',{quantity}),
   waitMs(quantity===100?850:650)
  ]);
  if(showcase)showcase.classList.remove('is-opening');
  applyServerPlayer(result.player);
  const awarded=Array.isArray(result.items)?result.items:[];
  if(awarded.length!==quantity)throw new Error('The server returned an incomplete Gem Crate result. Refresh and check your inventory.');
  await animateGemCrateRoll(quantity,awarded,result.rewards||{},ownedBefore);
  updateWallet();menu();
 }catch(e){
  if(showcase)showcase.classList.remove('is-opening');
  rolling=false;renderGemStore();
  toast(e.message||'Gem Crate failed to open');
 }
}
function applyServerPlayer(p){
 if(!p)return;
 for(const k of ['coins','gems','webCredits','multiplayerWins','multiplayerLosses','multiplayerKills','multiplayerHeadshots','adminKeys','guns','skins','discoveredGuns','indexGemMilestones','best','kills','xp','runs','gun','skin','hotbar'])if(p[k]!==undefined){S[k]=Array.isArray(p[k])?[...p[k]]:p[k]}
 if(Array.isArray(S.hotbar))S.hot=fixHot(S.hotbar,S.guns);
 S.guns=Array.isArray(S.guns)?S.guns:['pistol'];S.skins=Array.isArray(S.skins)?S.skins:['default'];
 if(!S.guns.includes(S.gun))S.gun=S.guns[0]||'pistol';if(!S.skins.includes(S.skin))S.skin='default';
 updateWallet();applyGun();
}
function renderSecureReveal(title,items,rewards={},ownedBefore=null){
 const groups=new Map();for(const x of items){const k=(x.type||'guns')+':'+x.id;const old=groups.get(k)||{...x,count:0};old.count++;groups.set(k,old)}
 const list=[...groups.values()].sort((a,b)=>rankScoreOf(b)-rankScoreOf(a)||String(a.name||a.id).localeCompare(String(b.name||b.id)));
 const art=x=>x.type==='skins'?`<div class="swc" style="background:linear-gradient(135deg,${hexc((SKINS[x.id]||{}).c||0x778899)},${hexc((SKINS[x.id]||{}).a||(SKINS[x.id]||{}).c||0x223344)})"></div>`:gunArt(x.id);
 const label=x=>x.name||((x.type==='skins'?SKINS:GUNS)[x.id]||{}).n||x.id;
 const rewardBits=[rewards.indexGems?`INDEX MILESTONES · +${rewards.indexGems} KittyGems`:'',rewards.bonusGems?`COLLECTION BONUS · +${rewards.bonusGems} KittyGems`:''].filter(Boolean).join(' · ');
 const rv=$('reveal');rv.style.display='flex';rv.className='secure-reveal';
 rv.innerHTML=`<div class="secure-reveal-panel"><span class="index-eyebrow">CRATEMASTER REWARDS</span><h2>${title}</h2><p class="secure-reveal-subtitle">${items.length.toLocaleString()} rewards revealed · ${list.length.toLocaleString()} unique item types</p><div class="secure-reveal-grid">${list.map((x,i)=>`<article class="secure-drop reveal-drop" style="--c:${rankColorOf(x)};--reveal-index:${Math.min(i,14)}"><div class="secure-drop-art">${art(x)}</div><b>${label(x)}</b>${isNewReward(x,ownedBefore)?'<span class="crate-new-badge reward-new-badge">NEW</span>':''}${rankBadge(x)}<em>${x.count>1?'×'+x.count+' DROPS':'1 DROP'}</em></article>`).join('')}</div>${rewardBits?`<p class="reward-line">${rewardBits}</p>`:''}<button class="big" onclick="closeRv()">NICE</button></div>`;
}

function updateWallet(){if($('coins'))$('coins').textContent=Number(S.coins||0).toLocaleString();if($('gems'))$('gems').textContent=Number(S.gems||0).toLocaleString();if($('webcredits'))$('webcredits').textContent=Number(S.webCredits||0).toLocaleString();
 // Admin Keys stay completely hidden until you own at least one.
 const keys=Number(S.adminKeys||0),kp=$('keypill');if(kp){kp.style.display=keys>=1?'':'none';if($('adminkeys'))$('adminkeys').textContent=keys.toLocaleString()}}

function menu(){
 const xp=S.xp||0,lv=lvOf(xp),lo=60*(lv-1)**2,hi=60*lv*lv;
 updateWallet();
 $('chip').innerHTML=`<div class="av">${shown()[0].toUpperCase()}</div><div class="who"><b>${shown()}</b><small>LV ${lv} · ${sync||'synced'}</small><div class="xp"><i style="width:${Math.round((xp-lo)/(hi-lo)*100)}%"></i></div></div><button class="sm" onclick="cloud.logout()">Sign out</button>`;
 document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.t==tab));
 document.querySelectorAll('.pane').forEach(p=>p.style.display=p.id=='p-'+tab?'block':'none');
 $('play').textContent=playing&&paused?'RESUME':'PLAY';$('endrun').style.display=playing&&paused?'inline-block':'none';
 $('stats').innerHTML=[['Best wave',S.best||0],['Total kills',S.kills||0],['Runs',S.runs||0],['Level',lv]].map(a=>`<div><b>${a[1]}</b>${a[0]}</div>`).join('');
 // Only build the active pane. Sign-in/save updates no longer regenerate 150+ hidden weapon cards.
 if(tab==='crates')renderCrateCards();
 if(tab==='locker')renderLockerCards();
 if(tab==='index'){indexMilestoneSync();renderIndex()}
 if(tab==='gemstore')renderGemStore();
 if(tab==='mail')renderMail();
 if(tab==='trade'&&typeof renderTrade=='function')renderTrade();
 if(tab==='multiplayer'&&window.cmMpRender)window.cmMpRender();
 if(tab==='lb')renderLb();
 if(document.activeElement!==$('o-nick'))$('o-nick').value=S.nick||'';
 $('o-sens').value=S.sens||1;$('o-vol').value=S.vol==null?1:S.vol;$('o-bloom').checked=S.bloom!==false;if($('o-quality'))$('o-quality').value=qualityMode;$('v-sens').textContent=(S.sens||1).toFixed(1);
}
let rolling=false;
async function requestCrateOpen(k,quantity){
 if(rolling)return;if(window.tradeLock){toast('Finish your trade first');return;}if(!cu||!cloud){toast('Sign in first');return;}
 const crates=allCR(),c=crates[k];if(!c){toast('This crate is no longer available');menu();return;}
 quantity=Math.floor(Number(quantity)||0);if(![1,10,100].includes(quantity))return;
 const cost=c.cost*quantity;if(Number(S.coins||0)<cost){toast('Not enough KittyCoins');return;}
 if(quantity>1&&!confirm(`Open ${quantity} ${c.n} crates for ${cost.toLocaleString()} KittyCoins?`))return;
 const ownedBefore=ownedBeforeSnapshot();
 rolling=true;try{
  const result=await cloud.action('/api/economy/open-crate',{crate:k,quantity});
  const awarded=Array.isArray(result.items)?result.items:[];
  if(awarded.length!==quantity)throw new Error('The server returned an incomplete crate result. Refresh and check your inventory.');
  applyServerPlayer(result.player);
  // The server has already selected and awarded the items. This client-side reel is presentation only.
  menuCache.crates=null;
  await animateCrateRoll(c.n,c,quantity,awarded,result.rewards||{},ownedBefore);
  updateWallet();menu();
 }catch(e){rolling=false;menu();toast(e.message||'Crate opening failed');}
}
function crateDropRank(item){
 const gun=GUNS[item.id]||{};
 if(item.admin||isAdminGun(gun))return 'admin';
 if(item.secret||isSecretGun(gun))return 'secret';
 if(item.limited||isLimitedGun(gun))return 'limited';
 if(item.gem||isGemRank(gun))return 'gem';
 const skin=SKINS[item.id]||{};
 const rarity=String(item.rarity||gun.r||skin.r||'common').toLowerCase();
 return R[rarity]?rarity:'common';
}
function crateVisualRarity(crate){
 const weights=Array.isArray(crate&&crate.w)?crate.w:[];
 const total=weights.reduce((sum,value)=>sum+Math.max(0,Number(value)||0),0);
 if(!total)return 'common';
 let roll=Math.random()*total;
 for(let i=0;i<weights.length;i++){
  roll-=Math.max(0,Number(weights[i])||0);
  if(roll<0)return RK[i]||'common';
 }
 return RK[Math.min(RK.length-1,weights.length-1)]||'common';
}
function crateRollCardMarkup(rarity){
 const key=R[rarity]?rarity:'common';
 return `<div class="rc" style="--c:${R[key]}"><b>?</b><small>${key.toUpperCase()}</small></div>`;
}
function crateRollWinnerMarkup(item){
 const rank=crateDropRank(item),color=R[rank]||R.common;
 const safeName=gemRollEsc(item.name||((item.type==='skins'?SKINS:GUNS)[item.id]||{}).n||item.id||'Mystery drop');
 let art='';
 if(item.type==='skins'){
  const skin=SKINS[item.id]||{};
  const first=hexc(Number(skin.c)||0x778899),second=hexc(Number(skin.a)||Number(skin.c)||0x223344);
  art=`<div class="swc" style="background:linear-gradient(135deg,${first},${second})"></div>`;
 }else art=GUNS[item.id]?gunArt(item.id):'<b>★</b>';
 return `${art}<small>${safeName}</small><em>${rank==='gem'?'GEM RANK':rank.toUpperCase()}</em>`;
}
function animateCrateRoll(crateName,crate,quantity,items,rewards={},ownedBefore=null){
 return new Promise(resolve=>{
  const rv=$('reveal');
  const size=quantity===1?'single':quantity===10?'ten':'hundred';
  const winIndex=size==='hundred'?16:54;
  const count=size==='hundred'?22:64;
  const step=size==='single'?140:size==='ten'?84:46;
  const duration=size==='single'?6200:size==='ten'?5200:3900;
  const center=size==='single'?65:size==='ten'?39:21;
  const rollClass=size==='single'?'':size==='ten'?'mini':'mega';
  const title=`OPENING ${String(crateName||'CRATE').toUpperCase()}${quantity>1?' ×'+quantity:''}`;
  const stripMarkup=(item,index)=>{
   const cards=Array.from({length:count},()=>crateVisualRarity(crate));
   cards[winIndex]=crateDropRank(item);
   return `<div class="roll ${rollClass}" aria-label="${gemRollEsc(crateName)} roll ${index+1}"><div class="marker"></div><div class="strip" id="normal-roll-strip-${index}">${cards.map(crateRollCardMarkup).join('')}</div></div>`;
  };
  if(size==='single'){
   rv.innerHTML=`<div class="rtitle">${title}</div>${stripMarkup(items[0],0)}<button class="link" id="normal-roll-skip">Skip animation</button>`;
  }else{
   const gridClass=size==='ten'?'rolls10':'rolls100';
   rv.innerHTML=`<div class="r10wrap crate-roll-batch"><div class="rtitle">${title}</div><div class="${gridClass}">${items.map(stripMarkup).join('')}</div><button class="link" id="normal-roll-skip">Skip animation</button></div>`;
  }
  rv.style.display='flex';
  rv.className='crate-roll-screen';
  const strips=items.map((_,i)=>$('normal-roll-strip-'+i));
  const viewWidths=strips.map(strip=>strip.parentElement.clientWidth||900);
  const distances=viewWidths.map(width=>winIndex*step+center-width/2);
  const finished=new Array(items.length).fill(false);
  let finishedCount=0,allFinished=false,raf=0,lastTick=-1;
  const safeX=element=>{
   const transform=getComputedStyle(element).transform;
   if(!transform||transform==='none')return 0;
   try{return new DOMMatrixReadOnly(transform).m41}catch(_){
    const match=transform.match(/^matrix\(([^)]+)\)$/);
    return match?Number(match[1].split(',')[4])||0:0;
   }
  };
  const finishOne=(index,skip=false)=>{
   if(finished[index])return;
   finished[index]=true;
   const strip=strips[index],item=items[index];
   if(!strip)return;
   if(skip){strip.style.transition='none';strip.style.transform=`translateX(${-distances[index]}px)`;}
   const winner=strip.children[winIndex];
   if(winner){
    const rank=crateDropRank(item);
    winner.style.setProperty('--c',R[rank]||R.common);
    winner.dataset.rank=rank;
    winner.classList.add('win',`rank-${rank}`);
    winner.innerHTML=crateRollWinnerMarkup(item);
    winner.title=`${rank==='gem'?'GEM RANK':rank.toUpperCase()} · ${item.name||item.id||''}`;
   }
   strip.classList.add('done');
   finishedCount++;
   if(finishedCount===items.length&&!allFinished){
    allFinished=true;
    if(raf)cancelAnimationFrame(raf);
    const skipButton=$('normal-roll-skip');if(skipButton)skipButton.remove();
    const bestItem=items.reduce((best,item)=>RANK_SCORE[crateDropRank(item)]>RANK_SCORE[crateDropRank(best)]?item:best,items[0]);
    const best=crateDropRank(bestItem||{rarity:'common'});
    rv.className=`r-${best} crate-roll-screen hit`;
    beep(best==='admin'?1500:best==='secret'?1320:best==='limited'?1120:best==='gem'?980:best==='legendary'?880:best==='epic'?660:440,.5,'triangle',.09);
    setTimeout(()=>{
     renderSecureReveal(`${String(crateName).toUpperCase()} ×${quantity}`,items,rewards,ownedBefore);
     resolve();
    },quantity===100?550:800);
   }
  };
  const tick=()=>{
   if(allFinished)return;
   try{
    const x=-safeX(strips[0]),current=Math.floor((x+viewWidths[0]/2)/step);
    if(current!==lastTick){lastTick=current;beep(250+(current%5)*24,.025,'square',.018);}
   }catch(_){}
   raf=requestAnimationFrame(tick);
  };
  const skipAll=()=>strips.forEach((_,i)=>finishOne(i,true));
  const skipButton=$('normal-roll-skip');if(skipButton)skipButton.onclick=skipAll;
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){setTimeout(skipAll,120);return;}
  strips.forEach(strip=>{strip.style.transform='translateX(0px)';void strip.offsetWidth;});
  setTimeout(()=>{
   strips.forEach((strip,index)=>{
    if(!strip)return;
    const stagger=size==='ten'?index*95:size==='hundred'?(index%10)*12:0;
    const ms=duration+stagger;
    strip.style.transition=`transform ${ms}ms cubic-bezier(.08,.6,.12,1)`;
    strip.style.transform=`translateX(${-distances[index]}px)`;
    strip.addEventListener('transitionend',event=>{if(event.target===strip)finishOne(index,false);},{once:true});
    setTimeout(()=>finishOne(index,false),ms+500);
   });
   tick();
  },65);
 });
}

function openCrate(k){return requestCrateOpen(k,1)}
function openTen(k){return requestCrateOpen(k,10)}
function openHundred(k){return requestCrateOpen(k,100)}
function sortInv(){S.guns.sort(gSort);menu();toast('Weapons sorted: Limited → GEM → Legendary → Epic → Rare → Common')}
function hset(i){hsel=i;menu()}
const LB_TYPES={
 money:{label:'Money',subtitle:'Players with the most KittyCoins',field:'coins',sort:'coins',column:'KittyCoins',value:p=>`<i class="coin"></i>${Number(p.coins||0).toLocaleString()}`},
 gems:{label:'KittyGems',subtitle:'Players with the most KittyGems',field:'gems',sort:'gems',column:'KittyGems',value:p=>`<i class="gem-icon"></i>${Number(p.gems||0).toLocaleString()}`},
 kills:{label:'Kills',subtitle:'Total bot eliminations across all runs',field:'kills',sort:'kills',column:'Total kills',value:p=>Number(p.kills||0).toLocaleString()},
 xp:{label:'Level / XP',subtitle:'Player level, ranked by total experience',field:'xp',sort:'xp',column:'Level / Experience',value:p=>`<b class="lb-level">LV ${Number(p.level||1).toLocaleString()}</b><small class="lb-subscore">${Number(p.xp||0).toLocaleString()} XP</small>`},
 wave:{label:'Best Wave',subtitle:'Highest wave reached in a single run',field:'best',sort:'best',column:'Best wave / kills',value:p=>`<b>${Number(p.best||0).toLocaleString()}</b><small class="lb-subscore">${Number(p.kills||0).toLocaleString()} total kills</small>`}
};
let lbType='money',lbData={},lbErrors={},lbAt={};
const lbUrl=(type,force=false)=>(typeof TRADE_URL=='string'?TRADE_URL:'').replace(/^ws/,'http')+'/leaderboard?type='+encodeURIComponent(type)+(force?'&fresh=1':'');
function setLbType(type){if(!LB_TYPES[type])return;lbType=type;renderLb();loadLb(true)}
function loadLb(force=false){
 const type=lbType,hasData=Array.isArray(lbData[type]);
 if(!force&&hasData&&Date.now()-(lbAt[type]||0)<15000){renderLb();return}
 if(!force&&lbAt[type]&&Date.now()-lbAt[type]<4000){renderLb();return}
 lbAt[type]=Date.now();lbErrors[type]='';renderLb();
 fetch(lbUrl(type,force),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(d=>{
  if(!Array.isArray(d))throw new Error('Invalid leaderboard response');
  lbData[type]=d;lbErrors[type]='';if(lbType===type)renderLb();
 }).catch(()=>{lbErrors[type]='Could not reach the leaderboard server. It may be waking up; try refreshing.';if(lbType===type)renderLb()});
}
function renderLb(){const el=$('lb');if(!el)return;
 const esc2=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cfg=LB_TYPES[lbType]||LB_TYPES.money,rows=lbData[lbType],err=lbErrors[lbType]||'';
 const buttons=Object.entries(LB_TYPES).map(([key,v])=>`<button class="lb-tab ${lbType===key?'on':''}" role="tab" aria-selected="${lbType===key}" onclick="setLbType('${key}')">${v.label}</button>`).join('');
 const table=Array.isArray(rows)?(rows.length?`<div class="lbh"><span>#</span><span>Player</span><span>${cfg.column||cfg.label}</span></div>`+rows.map((p,i)=>`<div class="lbr ${cu&&p.uid===cu.uid?'me':''}"><span class="lb-rank">${i+1}</span><span class="lb-player">${esc2(p.name||'Player')}${cu&&p.uid===cu.uid?'<small>YOU</small>':''}</span><span class="lb-value">${cfg.value(p)}</span></div>`).join(''):'<p class="lb-empty">No scores yet. Play a few rounds to claim a spot!</p>'):`<p class="lb-empty">${err?esc2(err):'Loading leaderboard…'}</p>`;
 el.innerHTML=`<div class="lb-hero"><div><span class="lb-eyebrow">CRATEMASTER RANKINGS</span><h2>Leaderboards</h2><p>${cfg.subtitle}</p></div><button class="sm lb-refresh" onclick="loadLb(true)">↻ Refresh</button></div><div class="lb-tabs" role="tablist">${buttons}</div><div class="lb-board">${table}</div><p class="lb-foot">Top 25 players · ${err?esc2(err):'Scores sync from player saves.'}</p>`;
}
function hclr(i){S.hot[i]='';if(curSlot==i)curSlot=-1;save();menu();applyGun()}
function toSlot(id){S.hot=fixHot(S.hot,S.guns);const at=hsel;
 if(S.hot[at]!=id){const o=S.hot.indexOf(id);
  if(cnt(S.hot,id)>=cnt(S.guns,id)&&o>=0)S.hot[o]=S.hot[at]; // no spare copy: move/swap
  S.hot[at]=id}
 S.gun=id;curSlot=at;const n=S.hot.indexOf('',at+1);save();hsel=n>=0?n:hsel;menu();applyGun();toast(GUNS[id].n+' → slot '+(at+1))}
function eq(t,id){if(t==='guns')S.gun=id;else S.skin=id;save();menu();applyGun()}
const rd=$('radar'),rg=rd.getContext('2d');
function radar(){const c=70,k=2.2;rg.clearRect(0,0,140,140);rg.save();rg.translate(c,c);rg.rotate(yaw);
 rg.fillStyle='#ffffff2a';for(const o of obs)rg.fillRect((o.x-P.x)*k-o.w*k,(o.z-P.z)*k-o.d*k,o.w*2*k,o.d*2*k);
 rg.fillStyle='#ff4a3a';rg.fillStyle='#3dff7a';for(const q of kits){const x=(q.position.x-P.x)*k,y=(q.position.z-P.z)*k;if(x*x+y*y<c*c){rg.fillRect(x-3,y-3,6,6)}}rg.fillStyle='#ff4a3a';for(const b of bots){const x=(b.position.x-P.x)*k,y=(b.position.z-P.z)*k;if(x*x+y*y<c*c){rg.beginPath();rg.arc(x,y,3.2,0,6.3);rg.fill()}}
 rg.restore();rg.fillStyle='#38e1ff';rg.beginPath();rg.moveTo(c,c-7);rg.lineTo(c-5,c+5);rg.lineTo(c+5,c+5);rg.fill()}

/* ---------- three.js scene ---------- */
const deviceCores=navigator.hardwareConcurrency||4;
const deviceMemory=navigator.deviceMemory||4;
const weakDevice=deviceCores<=4||deviceMemory<=4;
const validQuality=['auto','performance','balanced','high'];
let qualityMode='auto';
try{const stored=localStorage.getItem('cm-graphics-quality');if(validQuality.includes(stored))qualityMode=stored}catch{}
const effectiveQuality=()=>qualityMode==='auto'?(weakDevice?'performance':'balanced'):qualityMode;
const qualityProfile=()=>({
 performance:{ratio:1,shadows:false,shadowSize:512,post:false,maxFps:50,menuFps:30},
 balanced:{ratio:1.25,shadows:!weakDevice,shadowSize:1024,post:!weakDevice,maxFps:60,menuFps:30},
 high:{ratio:1.75,shadows:true,shadowSize:1536,post:true,maxFps:60,menuFps:30}
})[effectiveQuality()];
let activeQuality=qualityProfile();
const cv=$('c'),ren=new THREE.WebGLRenderer({canvas:cv,antialias:!weakDevice&&qualityMode!=='performance',powerPreference:'high-performance'});
ren.setPixelRatio(Math.min(devicePixelRatio||1,activeQuality.ratio));
ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.2;
ren.shadowMap.enabled=activeQuality.shadows;ren.shadowMap.type=THREE.PCFSoftShadowMap;
const sc=new THREE.Scene();sc.fog=new THREE.FogExp2(0x0d1226,.02);
const cam=new THREE.PerspectiveCamera(75,1,.1,100);cam.rotation.order='YXZ';sc.add(cam);
let comp=null,fxp=null,bloom=null;function rs(){ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();if(comp){comp.setSize(innerWidth,innerHeight);bloom.resolution.set(innerWidth,innerHeight)}}
addEventListener('resize',rs);rs();
function ctex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;if(rep)t.repeat.set(rep,rep);return t}
const noise=(g,w,h,n,a)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*a})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}};
const floorT=ctex(256,256,(g,w,h)=>{g.fillStyle='#1a2036';g.fillRect(0,0,w,h);noise(g,w,h,2500,.06);g.strokeStyle='#38e1ff66';g.lineWidth=4;g.strokeRect(2,2,w-4,h-4);g.strokeStyle='#ffffff14';g.lineWidth=1;g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke()},15);
const panT=ctex(128,128,(g,w,h)=>{g.fillStyle='#3a4468';g.fillRect(0,0,w,h);noise(g,w,h,900,.08);g.strokeStyle='#000a';g.lineWidth=6;g.strokeRect(0,0,w,h);g.fillStyle='#ffffff18';g.fillRect(10,10,w-20,5);g.fillStyle='#0006';[[14,60],[w-22,60]].forEach(a=>g.fillRect(a[0],a[1],8,8))});
const skyT=ctex(1024,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#04060e');gr.addColorStop(.5,'#141b3a');gr.addColorStop(.72,'#3a2a5c');gr.addColorStop(1,'#0d1226');g.fillStyle=gr;g.fillRect(0,0,w,h);for(let i=0;i<600;i++){g.fillStyle=`rgba(255,255,255,${Math.random()})`;const z=Math.random()*1.8;g.fillRect(Math.random()*w,Math.random()*h*.6,z,z)}const rg=g.createRadialGradient(780,90,2,780,90,70);rg.addColorStop(0,'#fff');rg.addColorStop(.15,'#dfe8ff');rg.addColorStop(1,'#dfe8ff00');g.fillStyle=rg;g.fillRect(700,10,170,170)});
const sky=new THREE.Mesh(new THREE.SphereGeometry(90,32,16),new THREE.MeshBasicMaterial({map:skyT,side:THREE.BackSide,fog:false}));sc.add(sky);
const envS=new THREE.Scene();envS.add(sky.clone());sc.environment=new THREE.PMREMGenerator(ren).fromScene(envS).texture;
sc.add(new THREE.HemisphereLight(0x7088ff,0x1a1020,.6));
const sun=new THREE.DirectionalLight(0xbfd0ff,1.5);sun.position.set(14,26,10);sun.castShadow=activeQuality.shadows;sun.shadow.mapSize.set(activeQuality.shadowSize,activeQuality.shadowSize);
const sh=sun.shadow.camera;sh.left=sh.bottom=-36;sh.right=sh.top=36;sh.near=1;sh.far=80;sun.shadow.bias=-.0004;sc.add(sun);
[[24,24,0x38e1ff],[-24,24,0xff3ad0],[24,-24,0xff3ad0],[-24,-24,0x38e1ff]].forEach(a=>{const l=new THREE.PointLight(a[2],1.6,42);l.position.set(a[0],6,a[1]);sc.add(l)});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({map:floorT,roughness:.35,metalness:.6}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.material.bumpMap=floorT;floor.material.bumpScale=1.5;sc.add(floor);
const solid=[],obs=[];
function block(x,z,w,d,h,col,acc,tex){
 const t=(tex||panT).clone();t.needsUpdate=true;t.repeat.set(Math.max(1,w|0),Math.max(1,h|0));
 const m=new THREE.Mesh(new THREE.BoxGeometry(w*2,h,d*2),new THREE.MeshStandardMaterial({map:t,color:col,roughness:.5,metalness:.5}));
 m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;
 if(acc){m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:acc})));
  const st=new THREE.Mesh(new THREE.BoxGeometry(w*2+.04,.1,d*2+.04),new THREE.MeshBasicMaterial({color:acc}));st.position.y=h/2-.12;m.add(st)}
 sc.add(m);solid.push(m);return m}
[[0,-30.5,31,.5],[0,30.5,31,.5],[-30.5,0,.5,31],[30.5,0,.5,31]].forEach(a=>block(a[0],a[1],a[2],a[3],5,0xffffff,0x38e1ff));
// Fixed arena cover positions keep the multiplayer map identical on every client.
const ARENA_OBSTACLES=[[-21,-20,1.2,1.5,3.1],[-11,-21,1.6,1.1,2.8],[2,-21,1.1,1.7,3.3],[16,-20,1.7,1.2,2.7],[23,-10,1.1,1.5,3.5],[18,5,1.4,1.1,2.5],[20,20,1.7,1.5,3.2],[7,21,1.2,1.8,2.8],[-8,21,1.8,1.1,3.4],[-22,19,1.2,1.5,2.6],[-23,5,1.8,1.2,3.0],[-15,-5,1.1,1.6,2.6],[15,-5,1.3,1.6,3.2],[0,13,1.7,1.2,2.9],[0,-13,1.5,1.1,2.7],[-5,4,1.1,1.1,3.1]];
for(let i=0;i<ARENA_OBSTACLES.length;i++){const [x,z,w,d,h]=ARENA_OBSTACLES[i];block(x,z,w,d,h,i%3?0xdde4ff:0xe6d2ff,i%3?0x38e1ff:0xff3ad0);obs.push({x,z,w,d})}
const crateT=ctex(128,128,(g,w,h)=>{g.fillStyle='#6b4a2a';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){g.fillStyle=`rgba(0,0,0,${Math.random()*.15})`;g.fillRect(0,Math.random()*h,w,2)}g.strokeStyle='#2a2f3d';g.lineWidth=14;g.strokeRect(7,7,w-14,h-14);g.beginPath();g.moveTo(0,0);g.lineTo(w,h);g.moveTo(w,0);g.lineTo(0,h);g.stroke();g.fillStyle='#ff8a1f';g.fillRect(w/2-12,w/2-12,24,24)});
const ARENA_CRATES=[[-19,-8],[-9,-12],[10,-12],[19,10],[9,12],[-18,11]];for(const [x,z] of ARENA_CRATES){block(x,z,1.1,1.1,2.2,0xffffff,0xff8a1f,crateT);obs.push({x,z,w:1.1,d:1.1})}
function collide(p,r){for(let it=0;it<2;it++){p.x=Math.max(-29,Math.min(29,p.x));p.z=Math.max(-29,Math.min(29,p.z));
 for(const o of obs){const dx=p.x-o.x,dz=p.z-o.z,ox=o.w+r-Math.abs(dx),oz=o.d+r-Math.abs(dz);if(ox>0&&oz>0){if(ox<oz)p.x+=ox*(dx<0?-1:1);else p.z+=oz*(dz<0?-1:1)}}}}

/* gun viewmodel: procedural class silhouettes with per-weapon geometry variation */
const gun=new THREE.Group();
const gunShellMat=new THREE.MeshStandardMaterial({color:0x777b88,metalness:.82,roughness:.26});
const gunDarkMat=new THREE.MeshStandardMaterial({color:0x141923,metalness:.72,roughness:.38});
const gunGripMat=new THREE.MeshStandardMaterial({color:0x242a36,metalness:.28,roughness:.72});
const gunAccentMat=new THREE.MeshStandardMaterial({color:0x38e1ff,metalness:.7,roughness:.24,emissive:0x101820});
const gunGlowMat=new THREE.MeshStandardMaterial({color:0x38e1ff,metalness:.3,roughness:.2,emissive:0x38e1ff,emissiveIntensity:1.2});
const weaponGeos=new Map(),weaponDetailMats=new Map();
const detailMatFor=id=>{if(!weaponDetailMats.has(id)){const h=gunHash(id),m=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL((h%360)/360,.72,.58),metalness:.65,roughness:.25,emissive:new THREE.Color().setHSL((h%360)/360,.8,.22),emissiveIntensity:.35});weaponDetailMats.set(id,m)}return weaponDetailMats.get(id)};
const geoBox=(w,h,d)=>{const k=`b:${w.toFixed(3)}:${h.toFixed(3)}:${d.toFixed(3)}`;if(!weaponGeos.has(k))weaponGeos.set(k,new THREE.BoxGeometry(w,h,d));return weaponGeos.get(k)};
const geoCyl=(rt,rb,h,n=12)=>{const k=`c:${rt.toFixed(3)}:${rb.toFixed(3)}:${h.toFixed(3)}:${n}`;if(!weaponGeos.has(k))weaponGeos.set(k,new THREE.CylinderGeometry(rt,rb,h,n));return weaponGeos.get(k)};
const geoSphere=(r=0.06,w=12,h=8)=>{const k=`s:${r.toFixed(3)}:${w}:${h}`;if(!weaponGeos.has(k))weaponGeos.set(k,new THREE.SphereGeometry(r,w,h));return weaponGeos.get(k)};
const geoOcta=(r=0.08)=>{const k=`o:${r.toFixed(3)}`;if(!weaponGeos.has(k))weaponGeos.set(k,new THREE.OctahedronGeometry(r,0));return weaponGeos.get(k)};
function applySkinPalette(){
 const skin=SKINS[S.skin]||SKINS.default,color=new THREE.Color(skin.c),accent=new THREE.Color(skin.a||skin.c).lerp(new THREE.Color(0xffffff),.12),dark=new THREE.Color(0x202838),white=new THREE.Color(0xf4f8ff);
 gunShellMat.color.copy(color).lerp(dark,.22);
 gunDarkMat.color.copy(color).multiplyScalar(.18).lerp(new THREE.Color(0x101522),.52);
 gunGripMat.color.copy(color).multiplyScalar(.28).lerp(new THREE.Color(0x171d2a),.56);
 gunAccentMat.color.copy(accent).lerp(white,.16);gunAccentMat.emissive.copy(accent).multiplyScalar(.11);
 gunGlowMat.color.copy(accent).lerp(white,.28);gunGlowMat.emissive.copy(accent);gunGlowMat.emissiveIntensity=skin.finish==='energy'?1.35:.72;
}
function buildWeaponModel(id){
 const G=GUNS[id]||GUNS.pistol,kind=gunFamily(id,G),h=gunHash(id);
 const profile=Number.isFinite(G.modelDesign)?G.modelDesign:(Number.isFinite(G.design)?G.design:h);
 const v=profile%7,v2=Math.floor(profile/7)%11,v3=Math.floor(profile/77)%7,v4=Math.floor(profile/539)%5;
 const model=new THREE.Group(),identityMat=detailMatFor(id);
 model.name='weapon:'+id;model.userData.weaponId=id;model.userData.modelDesign=profile;
 const box=(w,hh,d,mat,x,y,z,rz=0,rx=0)=>{const m=new THREE.Mesh(geoBox(w,hh,d),mat);m.position.set(x,y,z);m.rotation.set(rx,0,rz);model.add(m);return m};
 const cyl=(rt,rb,len,mat,x,y,z,rotX=Math.PI/2,rotZ=0,seg=12)=>{const m=new THREE.Mesh(geoCyl(rt,rb,len,seg),mat);m.position.set(x,y,z);m.rotation.set(rotX,0,rotZ);model.add(m);return m};
 const bodyW=(kind==='lmg' ? .31 : kind==='shotgun' ? .25 : kind==='sniper' ? .23 : kind==='energy' ? .27 : (kind==='pistol'||kind==='revolver') ? .2 : .25)*(0.80+v2*.035);
 const bodyH=(kind==='lmg'?.17:kind==='shotgun'?.13:kind==='sniper'?.12:kind==='energy'?.17:.14)*(0.84+v3*.035);
 const bodyL=((kind==='pistol'||kind==='revolver') ? .34 : kind==='lmg' ? .49 : kind==='shotgun' ? .5 : kind==='sniper' ? .42 : kind==='energy' ? .43 : kind==='smg' ? .39 : .44)*(0.86+v2*.025);
 const barrelLen=(kind==='sniper'?1.02:kind==='shotgun'?.78:kind==='lmg'?.76:kind==='rifle'?.73:kind==='energy'?.62:kind==='smg'?.53:kind==='revolver'?.29:.31)*(0.80+v3*.04+(v%5)*.018+v4*.009);
 // Main receiver, upper slide and layered side plates.
 box(bodyW,bodyH,bodyL,gunShellMat,0,0,0);
 box(bodyW*.94,.035,bodyL*.86,gunAccentMat,0,bodyH*.53,-.015);
 box(bodyW*.82,bodyH*.72,bodyL*.66,gunDarkMat,0,-bodyH*.02,.015);
 box(bodyW*.48,.018,bodyL*.48,gunAccentMat,0,bodyH*.57,-.025);
 // Barrel assembly and muzzle collar.
 const barrelZ=-(bodyL*.48+barrelLen*.5);
 cyl(kind==='shotgun'?.052:kind==='lmg'?.041:.032,kind==='shotgun'?.046:.028,barrelLen,gunDarkMat,0,.018,barrelZ);
 cyl(kind==='sniper'?.048:.043,kind==='sniper'?.045:.04,.07,gunAccentMat,0,.018,-(bodyL*.48+barrelLen));
 cyl(kind==='energy'?.056:.04,kind==='energy'?.052:.038,.045,gunDarkMat,0,.018,-(bodyL*.48+barrelLen+.035));
 // Weapon-specific stock and front furniture.
 if(kind==='pistol'||kind==='revolver'){
  box(bodyW*.72,.12,.12,gunGripMat,0,-.115,.13,-.19);
  box(bodyW*.18,.012,.22,gunAccentMat,0,.09,-.04);
  if(kind==='revolver'){
   cyl(.085,.085,.13,gunDarkMat,0,-.005,.07,0,Math.PI/2,16);
   for(let i=0;i<6;i++){const a=i*Math.PI/3;const m=new THREE.Mesh(geoCyl(.012,.012,.15,8),gunAccentMat);m.position.set(Math.cos(a)*.064,-.005,.07+Math.sin(a)*.064);m.rotation.z=Math.PI/2;model.add(m)}
  }else box(.075,.13,.09,gunGripMat,0,-.15,.12,-.2);
 }else{
  const stockLen=(kind==='sniper'?.43:kind==='shotgun'?.34:kind==='lmg'?.28:.24)*(0.72+v2*.045+v4*.025);
  box(bodyW*.8,.09,stockLen,gunGripMat,0,-.005,bodyL*.48+stockLen*.48);
  box(bodyW*.95,.14,.045,gunDarkMat,0,-.005,bodyL*.48+stockLen);
  if(kind==='shotgun'){
   cyl(.033,.033,.62,gunDarkMat,0,-.09,-.38);
   box(bodyW*.82,.11,.3,gunGripMat,0,-.085,-.43);
   for(let i=0;i<4;i++)box(bodyW*.9,.012,.018,gunAccentMat,0,-.02-i*.024,-.52);
  }else if(kind==='lmg'){
   cyl(.14,.14,.12,gunDarkMat,0,-.15,.02,0,Math.PI/2,18);
   cyl(.095,.095,.125,gunAccentMat,0,-.15,.02,0,Math.PI/2,16);
   box(.08,.13,.24,gunGripMat,0,-.17,-.18);
   box(.29,.035,.19,gunDarkMat,0,.14,.02);
  }else{
   const magLen=(kind==='sniper'?.23:kind==='energy'?.18:kind==='smg'?.29:.27)*(0.72+v3*.075+v4*.025);
   box(bodyW*.48,.21,magLen,gunDarkMat,0,-.16,.045,kind==='smg'?.16:.05);
   box(bodyW*.34,.12,magLen*.72,gunAccentMat,0,-.16,.05);
   if(kind==='smg')box(.08,.14,.18,gunGripMat,0,-.25,.13,-.12);
   if(kind==='sniper'){
    box(.04,.03,.17,gunDarkMat,-.07,-.19,-.44,-.2);box(.04,.03,.17,gunDarkMat,.07,-.19,-.44,.2);
   }
  }
 }
 // Optics / rails: scopes on long-range guns, compact sights on other families.
 box(bodyW*.75,.035,bodyL*.72,gunDarkMat,0,bodyH*.64,-.025);
 if(kind==='sniper'){
  cyl(.062+v2*.003,.062+v2*.003,.22+v3*.012,gunDarkMat,0,.14,-.08,0,0,16);
  cyl(.05+v2*.002,.05+v2*.002,.018,gunAccentMat,0,.14,-.205-v3*.006,0,0,16);
  cyl(.05+v2*.002,.05+v2*.002,.018,gunAccentMat,0,.14,.045+v3*.006,0,0,16);
  box(.08,.055,.13,gunDarkMat,0,.085,-.08);
 }else if(kind!=='pistol'&&kind!=='revolver'){
  box(.075,.09,.13,gunDarkMat,0,.12,-.08);
  box(.04,.018,.045,gunAccentMat,0,.17,-.08);
 }
 // Skin-colored side plates and vents make even weapons in the same class recognizable.
 const sideX=bodyW*.52;
 for(let i=0;i<2+(v%4);i++){
  const z=-bodyL*.28+i*.075;
  box(.012,.035,.042,i%2?gunAccentMat:gunDarkMat,sideX,.005,z);
 }
 if(v%2===0){box(.018,.065,.12,identityMat,sideX,.018,-.02,.18)}
 else{cyl(.018,.018,.035,identityMat,sideX,.045,.015,Math.PI/2,0,8)}
 if(kind==='energy'){
  box(.15,.06,.16,gunGlowMat,0,.1,-.22);
  for(let i=0;i<3;i++)cyl(.105,.105,.018,gunAccentMat,0,.1,-.17-i*.065,0,0,16);
  box(.09,.045,.08,gunGlowMat,0,-.04,.14);
 }
 // A small unique side badge varies by the weapon's stable hash.
 if(v2%3===0)box(.032,.022,.1,gunAccentMat,-sideX,.02,-.04,-.15);
 else if(v2%3===1)box(.025,.06,.075,gunDarkMat,-sideX,.02,-.04,.2);
 if(v===0)cyl(.024,.024,.018,identityMat,sideX+.008,.015,.1,0,0,10);
 else if(v===1)box(.065,.025,.055,identityMat,sideX+.008,.02,.1,.35);
 else if(v===2)box(.035,.06,.045,identityMat,sideX+.008,.02,.1,-.25);
 else if(v===3)cyl(.034,.034,.02,identityMat,sideX+.008,.02,.1,0,0,12);
 else box(.075,.018,.035,identityMat,sideX+.008,.02,.1);
 // Design-profile attachments: each five-part combination changes the stock, optic, magazine, muzzle and side plate.
 const stockType=Math.floor(profile/2)%5,opticType=Math.floor(profile/7)%5,magType=Math.floor(profile/35)%4,muzzleType=Math.floor(profile/140)%5;
 if(kind!=='pistol'&&kind!=='revolver'){
  const muzzleZ=-(bodyL*.48+barrelLen+.045);
  if(muzzleType===0)cyl(.046,.046,.12,gunDarkMat,0,.018,muzzleZ,Math.PI/2,0,14);
  else if(muzzleType===1){cyl(.058,.045,.075,gunAccentMat,0,.018,muzzleZ,Math.PI/2,0,12);box(.11,.035,.06,gunDarkMat,0,.018,muzzleZ-.035)}
  else if(muzzleType===2){cyl(.05,.04,.09,gunDarkMat,0,.018,muzzleZ,Math.PI/2,0,10);for(let k=0;k<3;k++)box(.012,.025,.05,gunAccentMat,0,.018,muzzleZ-.02+k*.025)}
  else{cyl(.075,.04,.12,gunGlowMat,0,.018,muzzleZ,Math.PI/2,0,16);cyl(.045,.045,.025,gunDarkMat,0,.018,muzzleZ-.06,Math.PI/2,0,16)}
  if(stockType===1)box(bodyW*.72,.045,.14,gunAccentMat,0,-.015,bodyL*.48+.12,.12);
  else if(stockType===2){box(bodyW*.13,.10,.23,gunDarkMat,-bodyW*.4,-.025,bodyL*.48+.08,.42);box(bodyW*.13,.10,.23,gunDarkMat,bodyW*.4,-.025,bodyL*.48+.08,-.42)}
  else if(stockType===3)box(bodyW*.62,.10,.10,gunGripMat,0,-.02,bodyL*.48+.16,-.1);
  else if(stockType===4){box(bodyW*.95,.045,.24,gunDarkMat,0,.10,bodyL*.48+.05);box(bodyW*.75,.025,.18,gunAccentMat,0,.13,bodyL*.48+.04)}
  if(opticType===1){box(.13,.08,.10,gunDarkMat,0,.18,-.11);box(.09,.018,.06,gunGlowMat,0,.224,-.11)}
  else if(opticType===2){cyl(.055,.055,.23,gunDarkMat,0,.16,-.10,0,0,16);cyl(.045,.045,.02,gunAccentMat,0,.16,-.22,0,0,16)}
  else if(opticType===3){box(.045,.12,.09,gunAccentMat,0,.15,-.08);box(.10,.025,.11,gunDarkMat,0,.21,-.08)}
  else if(opticType===4){box(.16,.035,.24,gunDarkMat,0,.15,-.06);box(.07,.075,.09,gunGlowMat,0,.19,-.06)}
  if(magType===1){box(bodyW*.48,.25,.15,gunDarkMat,0,-.18,.07,.18)}
  else if(magType===2){cyl(.12,.12,.12,gunDarkMat,0,-.18,.06,0,Math.PI/2,20);cyl(.09,.09,.125,gunAccentMat,0,-.18,.06,0,Math.PI/2,20)}
  else if(magType===3){box(bodyW*.55,.18,.26,gunDarkMat,0,-.17,.05);box(bodyW*.48,.06,.20,gunAccentMat,0,-.17,.05)}
  if(profile%5===0){box(.025,.055,.22,identityMat,bodyW*.53,.015,-.08,.12)}
  else if(profile%5===1){cyl(.035,.035,.025,identityMat,bodyW*.55,.02,.02,Math.PI/2,0,12)}
  else if(profile%5===2){box(.075,.025,.10,identityMat,-bodyW*.54,.02,.03,-.3)}
  else if(profile%5===3){box(.025,.08,.15,identityMat,-bodyW*.55,.02,-.02,.25)}else{box(.07,.035,.13,identityMat,-bodyW*.52,.03,.02,-.2)}
 }
 // Distinct 3D design language: segmented rails, asymmetrical side armour,
 // and family-tuned cooling fins make each active gun read as its own model.
 const railSegments=2+(v4%4),railZ0=-bodyL*.34,railStep=bodyL*.68/Math.max(1,railSegments-1);
 for(let ri=0;ri<railSegments;ri++){
  const rz=railZ0+ri*railStep;
  box(bodyW*.62,.012,.025,ri%2?gunAccentMat:gunDarkMat,0,bodyH*.72,rz,0);
 }
 const plateScale=.72+(v2%7)*.06;
 if(v4===0){box(bodyW*.18,.095,.12,identityMat,bodyW*.48,.005,.02,.18);box(bodyW*.18,.095,.12,gunDarkMat,-bodyW*.48,.005,.02,-.18)}
 else if(v4===1){for(let side of [-1,1])for(let n=0;n<3;n++)box(.018,.018,.075,gunGlowMat,side*bodyW*.54,.025,-.12+n*.09)}
 else if(v4===2){cyl(.045*plateScale,.045*plateScale,.025,identityMat,bodyW*.51,.025,-.06,Math.PI/2,0,10);cyl(.045*plateScale,.045*plateScale,.025,gunDarkMat,-bodyW*.51,.025,-.06,Math.PI/2,0,10)}
 else if(v4===3){box(bodyW*.26,.045,.19,gunGlowMat,0,bodyH*.78,.09,.08);box(bodyW*.18,.035,.12,identityMat,0,-bodyH*.58,.02,-.06)}
 else{for(let n=0;n<4;n++)box(bodyW*.78,.012,.018,n%2?gunAccentMat:gunDarkMat,0,-.015,-.16+n*.055)}
 // Weapon-family signature accents (fictional sci-fi styling, not real-world replicas).
 if(kind==='energy'){
  for(let coil=0;coil<2+(v%3);coil++){
   const z=-.24+coil*.11;
   cyl(.055+v3*.003,.055+v3*.003,.022,gunGlowMat,bodyW*.55,.055,z,Math.PI/2,0,12);
  }
 }else if(kind==='sniper'){
  box(.025,.11,.32,gunDarkMat,bodyW*.42,.11,-.08,.06);
  box(.025,.11,.32,gunAccentMat,-bodyW*.42,.11,-.08,-.06);
 }else if(kind==='shotgun'){
  cyl(.026,.026,.58,gunAccentMat,bodyW*.19,-.015,-.34,Math.PI/2,0,10);
 }else if(kind==='lmg'){
  for(let fin=0;fin<3+(v4%3);fin++)box(bodyW*.92,.014,.025,fin%2?gunAccentMat:gunDarkMat,0,bodyH*.55,-.17+fin*.065);
 }
 // Limited event weapons get a theme-specific 3D signature built from real meshes.
 // These decorative forms are deliberately stylized and remain part of the weapon model.
 const eventTheme=String(G.eventTheme||G.x||'');
 if(eventTheme){
  const palettes={
   spooky:[0xff7a25,0x9b62ff],og:[0x32e5c8,0xffd45a],easter:[0xff9dce,0xffe77b],
   popsicle:[0x60dfff,0xffa5ea],clover:[0x3bd17f,0xffd35b],christmas:[0xe94d68,0xf5f7ff],gem:[0x7048ff,0x52f5e0]
  };
  const colors=palettes[eventTheme]||[0x64d9ff,0xf5d36b];
  const mainMat=new THREE.MeshStandardMaterial({color:colors[0],metalness:.48,roughness:.26,emissive:colors[0],emissiveIntensity:.18});
  const accentMat=new THREE.MeshStandardMaterial({color:colors[1],metalness:.38,roughness:.24,emissive:colors[1],emissiveIntensity:.28});
  const style=Math.abs(Number(G.eventStyle??profile))%5,side=style%2?1:-1,offset=(style-2)*.018;
  const orb=(radius,mat,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geoSphere(radius),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.z=(style-2)*.12;model.add(m);return m};
  const crystal=(radius,mat,x,y,z)=>{const m=new THREE.Mesh(geoOcta(radius),mat);m.position.set(x,y,z);m.rotation.set(.18*style,.24*style,.31*style);model.add(m);return m};
  const eventY=bodyH*.88+.035, eventZ=offset;
  if(eventTheme==='spooky'){
   // Pumpkin core, bat-like fins and tiny glowing eyes.
   orb(.078,mainMat,side*bodyW*.23,eventY,eventZ,1.18,.88,.72);
   box(.105,.018,.13,accentMat,side*bodyW*.23,eventY+.04,eventZ-.01,.12);
   for(const wingSide of [-1,1]){box(.12,.018,.065,mainMat,side*bodyW*.23+wingSide*.105,eventY+.005,eventZ-.025,wingSide*.42);crystal(.024,accentMat,side*bodyW*.23+wingSide*.14,eventY+.015,eventZ-.035)}
   for(const eyeSide of [-1,1])orb(.012,accentMat,side*bodyW*.23+eyeSide*.025,eventY+.005,eventZ-.052,.9,.9,.65);
  }else if(eventTheme==='og'){
   // Retro pixel display and stepped 8-bit side blocks.
   box(.18,.12,.075,mainMat,side*bodyW*.28,eventY,eventZ,.02);
   box(.12,.065,.012,accentMat,side*bodyW*.28,eventY+.012,eventZ-.043);
   for(let i=0;i<3+(style%3);i++)box(.026,.022,.022,i%2?accentMat:mainMat,side*bodyW*.28-.06+i*.04,eventY-.065,eventZ+.018);
   box(.08,.018,.11,accentMat,-side*bodyW*.34,eventY-.015,eventZ+.02,-.18);
  }else if(eventTheme==='easter'){
   // Pastel egg chamber with a decorative stripe and petal accents.
   orb(.073,mainMat,side*bodyW*.22,eventY,eventZ, .78,1.2,.72);
   box(.12,.018,.105,accentMat,side*bodyW*.22,eventY-.005,eventZ-.008,.05);
   for(let i=0;i<3;i++)orb(.027,accentMat,side*bodyW*.22+(i-1)*.055,eventY+.095,eventZ-.005,.82,.72,.68);
   crystal(.025,accentMat,side*bodyW*.22,eventY+.145,eventZ-.02);
  }else if(eventTheme==='popsicle'){
   // Frosted ice-pop module with layered candy stripes and a crystal cap.
   box(.105,.17,.09,mainMat,side*bodyW*.24,eventY,eventZ,.08);
   for(let i=0;i<3;i++)box(.112,.018,.096,accentMat,side*bodyW*.24,eventY-.055+i*.05,eventZ-.008,.08);
   box(.035,.075,.032,accentMat,side*bodyW*.24,eventY-.12,eventZ+.04,0);
   crystal(.036,mainMat,side*bodyW*.24,eventY+.12,eventZ-.01);
  }else if(eventTheme==='clover'){
   // Three-leaf clover crest with a gold stem.
   orb(.045,mainMat,side*bodyW*.22-.035,eventY+.025,eventZ,.95,.8,.65);
   orb(.045,mainMat,side*bodyW*.22+.035,eventY+.025,eventZ,.95,.8,.65);
   orb(.045,mainMat,side*bodyW*.22,eventY+.065,eventZ-.005,.95,.8,.65);
   box(.018,.09,.02,accentMat,side*bodyW*.22,eventY-.025,eventZ-.005,.22+offset);
   crystal(.022,accentMat,side*bodyW*.22,eventY+.035,eventZ-.045);
  }else if(eventTheme==='gem'){
   // Gemheart Secret: a faceted floating core, orbiting shards and twin energy rings.
   crystal(.105,mainMat,side*bodyW*.22,eventY,eventZ-.015);
   orb(.055,accentMat,side*bodyW*.22,eventY,eventZ-.075,.82,.82,.82);
   for(let shard=0;shard<4;shard++){
    const a=shard*Math.PI/2;
    crystal(.034,shard%2?accentMat:mainMat,side*bodyW*.22+Math.cos(a)*.13,eventY+Math.sin(a)*.085,eventZ-.035);
   }
   box(.19,.018,.025,accentMat,side*bodyW*.22,eventY-.12,eventZ-.035,.12);
   box(.19,.018,.025,mainMat,side*bodyW*.22,eventY+.12,eventZ-.035,-.12);
  }else if(eventTheme==='christmas'){
   // Snow-star crest, bauble nodes and candy-cane cross bars.
   crystal(.095,mainMat,side*bodyW*.22,eventY,eventZ);
   box(.018,.18,.025,accentMat,side*bodyW*.22,eventY,eventZ-.02,.08);
   box(.15,.018,.025,accentMat,side*bodyW*.22,eventY,eventZ-.02,.08);
   orb(.025,accentMat,side*bodyW*.22-.09,eventY-.045,eventZ+.015,.9,.9,.9);
   orb(.025,mainMat,side*bodyW*.22+.09,eventY+.045,eventZ+.015,.9,.9,.9);
  }
  // Every style index receives a different crest rotation and side-position detail.
  crystal(.018+(style%3)*.004,accentMat,-side*bodyW*.55,eventY-.025,eventZ-.06);
 }
 model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false}});
 return model;
}
cam.add(gun);
const glowTex=ctex(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,1,32,32,32);r.addColorStop(0,'#fff');r.addColorStop(.25,'#ffd070');r.addColorStop(1,'#ff800000');g.fillStyle=r;g.fillRect(0,0,w,h)});
const flashM=new THREE.Mesh(new THREE.PlaneGeometry(.55,.55),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false,opacity:0}));
flashM.position.set(.33,-.29,-1.15);cam.add(flashM);
const mLight=new THREE.PointLight(0xffb050,0,9);mLight.position.set(.33,-.24,-1.1);cam.add(mLight);
function drawHot(){const el=$('hotbar');if(!el)return;el.innerHTML=S.hot.map((g,i)=>{const G=GUNS[g];return `<div class="hb ${g&&g==S.gun&&(curSlot<0||S.hot[curSlot]!=S.gun||curSlot==i)?'on':''} ${G?'':'em'}" style="--c:${G?rankColorOf(G):'#555'}"><em>${i+1}</em>${G?`${gunArt(g)}<b>${G.n}</b>${rankBadge(G)}`:''}</div>`}).join('')}
// Lazy 3D model cache: only recently used weapons stay resident. Meshes are
// generated from each gun's unique modelDesign and share cached base geometry.
const weaponModelCache=new Map();
function getWeaponModel(id){
 if(weaponModelCache.has(id)){
  const hit=weaponModelCache.get(id);weaponModelCache.delete(id);weaponModelCache.set(id,hit);return hit;
 }
 const model=buildWeaponModel(id);weaponModelCache.set(id,model);
 while(weaponModelCache.size>16)weaponModelCache.delete(weaponModelCache.keys().next().value);
 return model;
}

// Lightweight 3D item previews for the Locker, Index, hotbar, crates, rewards
// and trade UI. One offscreen renderer is reused; visible cards are rendered
// on demand and cached, so 500 catalogue entries do not create 500 WebGL contexts.
const PREVIEW_W=240,PREVIEW_H=110,weaponPreviewCache=new Map(),weaponPreviewQueue=[];
let previewRenderer=null,previewQueueFrame=0;
const previewScene=new THREE.Scene();
previewScene.add(new THREE.HemisphereLight(0xc9ddff,0x172033,1.25));
const previewKeyLight=new THREE.DirectionalLight(0xffffff,2.05);previewKeyLight.position.set(3,4,-4);previewScene.add(previewKeyLight);
const previewRimLight=new THREE.DirectionalLight(0x56e7ff,1.05);previewRimLight.position.set(-3,1,3);previewScene.add(previewRimLight);
const previewCamera=new THREE.PerspectiveCamera(30,PREVIEW_W/PREVIEW_H,.01,80);
try{
 previewRenderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 previewRenderer.setPixelRatio(1);previewRenderer.setSize(PREVIEW_W,PREVIEW_H,false);
 previewRenderer.setClearColor(0x000000,0);previewRenderer.outputEncoding=THREE.sRGBEncoding;
 previewRenderer.toneMapping=THREE.ACESFilmicToneMapping;previewRenderer.toneMappingExposure=1.12;
}catch(previewError){console.warn('3D card previews unavailable; using the built-in 2D fallback.',previewError);previewRenderer=null}
function cloneWeaponForPreview(id,skinId){
 const model=buildWeaponModel(id),skin=SKINS[skinId]||SKINS.default;
 const base=new THREE.Color(Number(skin.c)||0x777b88),accent=new THREE.Color(Number(skin.a)||Number(skin.c)||0x38e1ff).lerp(new THREE.Color(0xffffff),.12);
 const dark=new THREE.Color(0x202838),white=new THREE.Color(0xf4f8ff),identity=detailMatFor(id),clones=new Map();
 model.traverse(obj=>{
  if(!obj.isMesh)return;
  const source=obj.material;
  if(!clones.has(source)){
   const material=source.clone();
   if(source===gunShellMat)material.color.copy(base).lerp(dark,.22);
   else if(source===gunDarkMat)material.color.copy(base).multiplyScalar(.18).lerp(new THREE.Color(0x101522),.52);
   else if(source===gunGripMat)material.color.copy(base).multiplyScalar(.28).lerp(new THREE.Color(0x171d2a),.56);
   else if(source===gunAccentMat){material.color.copy(accent).lerp(white,.16);material.emissive.copy(accent).multiplyScalar(.11)}
   else if(source===gunGlowMat){material.color.copy(accent).lerp(white,.28);material.emissive.copy(accent);material.emissiveIntensity=skin.finish==='energy'?1.35:.72}
   else if(source===identity){material.color.copy(accent).lerp(white,.2);material.emissive.copy(accent).multiplyScalar(.08)}
   clones.set(source,material);
  }
  obj.material=clones.get(source);obj.castShadow=false;obj.receiveShadow=false;
 });
 model.rotation.set(.12,.46,0);model.updateMatrixWorld(true);
 let bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
 model.position.sub(center);const maxDimension=Math.max(size.x,size.y,size.z)||1;model.scale.setScalar(1.48/maxDimension);
 model.updateMatrixWorld(true);bounds=new THREE.Box3().setFromObject(model);center=bounds.getCenter(new THREE.Vector3());model.position.sub(center);model.updateMatrixWorld(true);
 const sphere=bounds.getBoundingSphere(new THREE.Sphere()),distance=Math.max(2.4,sphere.radius*4.6);
 previewCamera.position.set(distance*.88,distance*.48,-distance*1.15);previewCamera.lookAt(0,0,0);previewCamera.near=.01;previewCamera.far=80;previewCamera.updateProjectionMatrix();
 return {model,materials:[...clones.values()]};
}
function paintPreviewFallback(canvas){
 const fallback=canvas.parentElement?.querySelector('.weapon-3d-fallback');
 canvas.hidden=true;if(fallback)fallback.hidden=false;
}
function drawPreviewSnapshot(canvas,snapshot){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(snapshot,0,0,canvas.width,canvas.height);
 canvas.hidden=false;const fallback=canvas.parentElement?.querySelector('.weapon-3d-fallback');if(fallback)fallback.hidden=true;
}
function renderWeaponPreview(canvas){
 if(!canvas||!canvas.isConnected)return;
 const id=GUNS[canvas.dataset.gunPreview]?canvas.dataset.gunPreview:'pistol',skinId=SKINS[canvas.dataset.skinPreview]?canvas.dataset.skinPreview:'default',key=id+'|'+skinId;
 if(canvas.dataset.previewRendered===key)return;
 const cached=weaponPreviewCache.get(key);
 if(cached){weaponPreviewCache.delete(key);weaponPreviewCache.set(key,cached);drawPreviewSnapshot(canvas,cached);canvas.dataset.previewRendered=key;return}
 if(!previewRenderer){paintPreviewFallback(canvas);return}
 let built=null;
 try{
  built=cloneWeaponForPreview(id,skinId);previewScene.add(built.model);
  previewRenderer.setSize(canvas.width||PREVIEW_W,canvas.height||PREVIEW_H,false);previewRenderer.clear(true,true,true);previewRenderer.render(previewScene,previewCamera);
  const snapshot=document.createElement('canvas');snapshot.width=canvas.width||PREVIEW_W;snapshot.height=canvas.height||PREVIEW_H;
  const snapCtx=snapshot.getContext('2d');snapCtx.drawImage(previewRenderer.domElement,0,0,snapshot.width,snapshot.height);
  previewScene.remove(built.model);built.materials.forEach(material=>material.dispose());built=null;
  weaponPreviewCache.set(key,snapshot);while(weaponPreviewCache.size>96)weaponPreviewCache.delete(weaponPreviewCache.keys().next().value);
  drawPreviewSnapshot(canvas,snapshot);canvas.dataset.previewRendered=key;
 }catch(error){
  if(built){previewScene.remove(built.model);built.materials.forEach(material=>material.dispose())}
  console.warn('Could not render 3D item preview:',id,error);paintPreviewFallback(canvas);
 }
}
function queueWeaponPreview(canvas){
 if(!canvas||canvas.dataset.previewQueued==='1')return;
 canvas.dataset.previewQueued='1';weaponPreviewQueue.push(canvas);
 if(!previewQueueFrame)previewQueueFrame=requestAnimationFrame(flushWeaponPreviewQueue);
}
function flushWeaponPreviewQueue(){
 previewQueueFrame=0;
 // One model render per animation frame keeps menu opening responsive on weaker PCs.
 const canvas=weaponPreviewQueue.shift();if(canvas&&canvas.isConnected)renderWeaponPreview(canvas);
 if(weaponPreviewQueue.length)previewQueueFrame=requestAnimationFrame(flushWeaponPreviewQueue);
}
let previewIntersection=null;
if('IntersectionObserver' in window){
 previewIntersection=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){queueWeaponPreview(entry.target);previewIntersection.unobserve(entry.target)}
 }),{rootMargin:'180px 0px'});
}
function scanWeaponPreviewNode(node){
 if(!node||node.nodeType!==1)return;
 if(node.matches?.('canvas[data-gun-preview]'))previewIntersection?previewIntersection.observe(node):queueWeaponPreview(node);
 node.querySelectorAll?.('canvas[data-gun-preview]').forEach(canvas=>previewIntersection?previewIntersection.observe(canvas):queueWeaponPreview(canvas));
}
if('MutationObserver' in window){
 const previewMutationObserver=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(scanWeaponPreviewNode)));
 previewMutationObserver.observe(document.body,{childList:true,subtree:true});
}
scanWeaponPreviewNode(document.body);
function applyGun(){
 const id=GUNS[S.gun]?S.gun:'pistol',G=GUNS[id]||GUNS.pistol;
 swapT=1;applySkinPalette();gun.clear();gun.add(getWeaponModel(id));
 gun.scale.set(.72,.72,G.l*.72);drawHot();
 $('wpn').innerHTML=`${G.n}<br><small style="color:${rankColorOf(G)}">${(SKINS[S.skin]||SKINS.default).n} · ${rankLabelOf(G)}</small>`;
}
/* decor */
const emb=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshBasicMaterial({map:ctex(512,512,(g)=>{g.strokeStyle='#ff8a1f';g.lineWidth=10;g.shadowColor='#ff8a1f';g.shadowBlur=24;g.beginPath();g.arc(256,256,200,0,6.283);g.stroke();g.lineWidth=5;g.strokeRect(166,166,180,180);g.font='bold 54px system-ui';g.textAlign='center';g.fillStyle='#ff8a1f';g.fillText('CM',256,275)}),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
emb.rotation.x=-Math.PI/2;emb.position.y=.03;sc.add(emb);
const rings=[];[[24,24,0x38e1ff],[-24,24,0xff3ad0],[24,-24,0xff3ad0],[-24,-24,0x38e1ff]].forEach(a=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,9,12),new THREE.MeshBasicMaterial({color:a[2]}));c.position.set(a[0],4.5,a[1]);sc.add(c);
 for(let k=0;k<2;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.2+k*.5,.05,8,40),new THREE.MeshBasicMaterial({color:a[2]}));r.position.set(a[0],3+k*2.5,a[1]);r.rotation.x=1.2;r.k=k;sc.add(r);rings.push(r)}});
const dp=new Float32Array(900);for(let i=0;i<900;i+=3){dp[i]=(Math.random()-.5)*58;dp[i+1]=Math.random()*9;dp[i+2]=(Math.random()-.5)*58}
const dustG=new THREE.BufferGeometry();dustG.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dust=new THREE.Points(dustG,new THREE.PointsMaterial({size:.14,map:glowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:0x9fb4ff,opacity:.7}));sc.add(dust);
/* post-processing: bloom + vignette + chromatic aberration + grain */
const FX={uniforms:{tDiffuse:{value:null},t:{value:0},h:{value:0}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform sampler2D tDiffuse;uniform float t;uniform float h;varying vec2 v;float r(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec2 c=v-.5;float d=dot(c,c);vec2 o=c*d*.025;vec3 col=vec3(texture2D(tDiffuse,v+o).r,texture2D(tDiffuse,v).g,texture2D(tDiffuse,v-o).b);col*=1.-d*1.4;col.r+=h*d*3.;col=(col-.5)*1.1+.5;col+=(r(v*800.+t)-.5)*.03;gl_FragColor=vec4(col,1.);}'};
try{const pr=Math.min(devicePixelRatio,2);
 comp=new THREE.EffectComposer(ren,new THREE.WebGLMultisampleRenderTarget(innerWidth*pr,innerHeight*pr,{format:THREE.RGBAFormat}));comp.setPixelRatio(pr);
 comp.addPass(new THREE.RenderPass(sc,cam));
 bloom=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.8,.6,.65);comp.addPass(bloom);
 fxp=new THREE.ShaderPass(FX);comp.addPass(fxp);comp.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));comp.setSize(innerWidth,innerHeight)}catch(e){comp=null}
function applyGraphicsQuality(){
 activeQuality=qualityProfile();
 const ratio=Math.min(devicePixelRatio||1,activeQuality.ratio);
 ren.setPixelRatio(ratio);ren.shadowMap.enabled=activeQuality.shadows;
 sun.castShadow=activeQuality.shadows;sun.shadow.mapSize.set(activeQuality.shadowSize,activeQuality.shadowSize);sun.shadow.needsUpdate=true;
 ren.setSize(innerWidth,innerHeight,false);
 if(comp){comp.setPixelRatio(ratio);comp.setSize(innerWidth,innerHeight)}
 document.documentElement.dataset.graphics=effectiveQuality();
}
function setGraphicsQuality(value){
 if(!validQuality.includes(value))return;
 qualityMode=value;try{localStorage.setItem('cm-graphics-quality',value)}catch{}
 applyGraphicsQuality();if($('o-quality'))$('o-quality').value=value;
 toast('Graphics quality: '+effectiveQuality().toUpperCase());
}
applyGraphicsQuality();
/* bullet decals */
const dM=new THREE.MeshBasicMaterial({map:ctex(32,32,(g)=>{const r=g.createRadialGradient(16,16,1,16,16,15);r.addColorStop(0,'#000');r.addColorStop(.5,'#000a');r.addColorStop(1,'#0000');g.fillStyle=r;g.fillRect(0,0,32,32)}),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4}),dg=new THREE.PlaneGeometry(.22,.22),decs=[];let di=0;
function decal(p,n){const k=di++%40;let m=decs[k];if(!m){m=new THREE.Mesh(dg,dM);sc.add(m);decs[k]=m}m.position.copy(p).addScaledVector(n,.02);m.lookAt(p.clone().add(n))}
/* particles */
const pg=new THREE.BoxGeometry(.07,.07,.07),pmat=[0xffd27a,0xff4a2a,0x8fe8ff].map(c=>new THREE.MeshBasicMaterial({color:c})),pts=[];
function burst(pos,n,ci,spd){for(let i=0;i<n;i++){const m=new THREE.Mesh(pg,pmat[ci]);m.position.copy(pos);m.v=new THREE.Vector3(Math.random()-.5,Math.random()*.9,Math.random()-.5).multiplyScalar(spd*(.4+Math.random()));m.life=m.max=.35+Math.random()*.45;sc.add(m);pts.push(m)}}

/* ---------- game state ---------- */
const P=new THREE.Vector3(0,0,0),rc=new THREE.Raycaster(),bots=[],tr=[],dead=[],kits=[];
let playing=false,paused=false,locked=false,fallback=false,down=false;
let st={c:0,xp:0},yaw=0,pitch=0,hp=100,wave=0,kills=0,toSpawn=0,spT=0,nwT=0,waiting=false,next=0,now=0,kick=0,bob=0,botId=0,hmT=0,fT=0,mT=0,fH=0,swapT=0,jy=0,jv=0,landT=0,tR=0,sA=0;
const keys={};window.__cmKeys=keys;
function say(t){const m=$('msg');m.textContent=t;m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')}
function hud(){$('hw').textContent=wave;$('hb').textContent=bots.length+toSpawn;$('hk').textContent=kills;$('hc').textContent=(Number(S.coins)||0)+(runCoinsEarned||0);$('hpn').textContent=Math.max(0,Math.ceil(hp));$('hp').style.width=Math.max(0,hp)+'%';$('hpw').classList.toggle('low',hp<35)}

/* ---------- animations ---------- */
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function animBot(g,dt,d){
 g.sp=Math.min(1,g.sp+dt*2.2);const sp=g.sp,pop=sp<1?ease(sp)*(1+Math.sin(sp*Math.PI)*.18):1;g.scale.setScalar(Math.max(.01,pop));
 g.rc=Math.max(0,g.rc-dt*4);const sw=Math.sin(g.ph),aim=g.cd<.45||g.rc>0;
 g.legs[0].rotation.x=sw*.7;g.legs[1].rotation.x=-sw*.7;
 g.legs[0].position.y=.28+Math.max(0,sw)*.08;g.legs[1].position.y=.28+Math.max(0,-sw)*.08;
 g.body.position.y=Math.abs(sw)*.07;
 g.body.rotation.x=.12+(g.fl>0?-.35*(g.fl/.08):0)-g.rc*.18;g.body.rotation.z=sw*.05;
 g.headG.rotation.y=aim?0:Math.sin(now*2+g.id)*.35;g.headG.rotation.x=aim?-.1:Math.sin(now*3+g.id)*.05;
 const tgt=aim?-1.35-g.rc*.35:0;
 g.arms[1].rotation.x+=((aim?tgt:-sw*.6)-g.arms[1].rotation.x)*Math.min(1,dt*18);
 g.arms[0].rotation.x+=((aim?tgt+.15:sw*.6)-g.arms[0].rotation.x)*Math.min(1,dt*18);
 g.eyes.color.setHex(aim?0xffffff:0xff2a2a);
}
function animDead(dt){
 for(let i=dead.length-1;i>=0;i--){const g=dead[i];g.dying+=dt;const t=Math.min(1,g.dying/.55);
  g.rotation.x=-ease(t)*1.5;g.position.y=-ease(t)*.15;g.arms[0].rotation.x=-t*2;g.arms[1].rotation.x=-t*1.6;g.legs[0].rotation.x=t*.4;
  if(g.dying>.8){const k=Math.max(.001,1-(g.dying-.8)/.35);g.scale.setScalar(k)}
  if(g.dying>1.15){sc.remove(g);dead.splice(i,1)}}
}
/* ---------- bot AI ---------- */
const AI_ANG=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d};
const _f=new THREE.Vector3(),_t=new THREE.Vector3(),_d=new THREE.Vector3();
function aiLos(g){_f.set(g.position.x,1.5,g.position.z);_d.set(P.x-_f.x,1.5+jy-_f.y,P.z-_f.z);const L=_d.length();_d.normalize();rc.set(_f,_d);rc.far=L;return !rc.intersectObjects(solid,false).length}
function coverPoint(g){let best=null,bd=1e9;for(const o of obs){const ax=o.x-P.x,az=o.z-P.z,al=Math.hypot(ax,az)||1,px=o.x+ax/al*(Math.max(o.w,o.d)+1.3),pz=o.z+az/al*(Math.max(o.w,o.d)+1.3);
  if(Math.abs(px)>28||Math.abs(pz)>28)continue;const dd=Math.hypot(px-g.position.x,pz-g.position.z)+Math.hypot(P.x-px,P.z-pz)*-.15;if(dd<bd){bd=dd;best={x:px,z:pz}}}return best}
function aiBot(g,dt){
 const R=g.R,px=g.position.x,pz=g.position.z;let dx=P.x-px,dz=P.z-pz;const d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;
 g.losT-=dt;if(g.losT<=0){g.los=d<45&&aiLos(g);g.losT=.12+Math.random()*.1}
 g.strT-=dt;if(g.strT<=0){g.side*=-1;g.strT=.8+Math.random()*1.8}
 g.hit=Math.max(0,g.hit-dt);if(g.hp<g.lastHp)g.hit=.6;g.lastHp=g.hp;
 let wx=0,wz=0,spd=1;const frac=g.hp/g.mx;
 // retreat to cover when badly hurt (not rushers)
 g.noCover=Math.max(0,(g.noCover||0)-dt);if(frac<.35&&g.role!=='rusher'&&d>5&&!g.noCover){if(!g.cover){g.cover=coverPoint(g);g.hideT=0}}else if(frac>=.35)g.cover=null;
 if(g.cover&&Math.hypot(g.cover.x-px,g.cover.z-pz)>1){const cx=g.cover.x-px,cz=g.cover.z-pz,cl=Math.hypot(cx,cz);wx=cx/cl;wz=cz/cl;spd=1.15}
 else if(g.cover){ // hiding behind cover, then peek back out
  g.hideT+=dt;if(g.los||g.hideT>2.5){g.cover=null;g.noCover=4}else{wx=wz=0;spd=0}}
 else if(!g.los&&d>3){ // no line of sight: go around, slide along the blocker
  wx=dx*.8-dz*g.side*.6;wz=dz*.8+dx*g.side*.6;spd=1.05}
 else if(d>R.hi){wx=dx;wz=dz;if(g.role==='rusher'||d>R.hi+8)spd=1.1}
 else if(d<R.lo){wx=-dx*.9-dz*g.side*.5;wz=-dz*.9+dx*g.side*.5;spd=.9}
 else{ // strafe, with dodges when the player is aiming at us
  wx=-dz*g.side;wz=dx*g.side;spd=.7;
  if(playing&&down){const lx=-Math.sin(yaw),lz=-Math.cos(yaw),al=-(dx*lx+dz*lz);if(al>.97){spd=1.6}}}
 // obstacle avoidance: repel from nearby blocks, slide around them
 for(const o of obs){const ax=px-o.x,az=pz-o.z,ex=Math.max(0,Math.abs(ax)-o.w),ez=Math.max(0,Math.abs(az)-o.d),dist=Math.hypot(ex,ez);
  if(dist<2.4){const k=(1-dist/2.4),rl=Math.hypot(ax,az)||1,rx=ax/rl,rz=az/rl;let tx=-rz,tz=rx;if(tx*wx+tz*wz<0){tx=-tx;tz=-tz}wx+=rx*k*1.5+tx*k*1.3;wz+=rz*k*1.5+tz*k*1.3}}
 // separation from other bots
 for(const b of bots){if(b===g)continue;const sx=px-b.position.x,sz=pz-b.position.z,sd=Math.hypot(sx,sz);if(sd<2&&sd>.001){const k=(2-sd)/2;wx+=sx/sd*k*1.6;wz+=sz/sd*k*1.6}}
 // keep off the arena walls
 if(Math.abs(px)>26)wx-=Math.sign(px)*.8;if(Math.abs(pz)>26)wz-=Math.sign(pz)*.8;
 const wl=Math.hypot(wx,wz);if(wl>0){wx/=wl;wz/=wl}else{wx=wz=0}
 const top=Math.min(6.2,(2.5+wave*.25))*R.spd*spd*(g.hit>0?.7:1);
 const ac=Math.min(1,dt*6);g.vx+=(wx*top-g.vx)*ac;g.vz+=(wz*top-g.vz)*ac;
 const ox=g.position.x,oz=g.position.z;g.position.x+=g.vx*dt;g.position.z+=g.vz*dt;collide(g.position,.6);
 // stuck detection: wiggle out by flipping side
 const mv=Math.hypot(g.position.x-ox,g.position.z-oz)/Math.max(dt,1e-4);
 if(top>1&&mv<top*.25){g.stuck+=dt;if(g.stuck>.5){g.side*=-1;g.strT=1.2;g.stuck=0;g.cover=null}}else g.stuck=Math.max(0,g.stuck-dt);
 // face the player smoothly (or the way we're running when no sight)
 const want=g.los||d<10?Math.atan2(P.x-px,P.z-pz):(Math.hypot(g.vx,g.vz)>.3?Math.atan2(g.vx,g.vz):g.rotation.y);
 g.rotation.y+=AI_ANG(g.rotation.y,want)*Math.min(1,dt*9);
 g.ph+=dt*(Math.hypot(g.vx,g.vz)*1.2);
 return d}
function aiShoot(g,dt,d){
 const R=g.R;g.cd-=dt*(g.los?1:.4);
 if(g.cd>0||d>=36||!g.los)return;
 g.cd=(1.0+Math.random()*1.3)*R.cd*Math.max(.55,1-wave*.03);g.rc=1;
 const from=new THREE.Vector3(g.position.x,1.5,g.position.z),to=new THREE.Vector3(P.x,1.4+jy,P.z);
 // accuracy drops with distance and when the player is moving / airborne, rises with wave
 const pm=(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD)?.1:0,j=jy>0?.12:0;
 const acc=Math.max(.12,Math.min(.85,.62-d*.011-pm-j+wave*.012+(g.role==='sniper'?.18:0)));
 if(Math.random()<acc){tracer(from,to,0xff4040);hurt(Math.round((6+wave)*R.dmg));beep(160,.05,'sawtooth',.03)}
 else{to.x+=(Math.random()-.5)*2.4;to.y+=(Math.random()-.3)*1.6;to.z+=(Math.random()-.5)*2.4;tracer(from,to,0xff9040)}
}

/* ---------- medkits ---------- */
const kitM={w:new THREE.MeshStandardMaterial({color:0xf2f4f8,roughness:.4,emissive:0x223322}),r:new THREE.MeshBasicMaterial({color:0xff2a3a})};
function clearKits(){kits.forEach(k=>sc.remove(k));kits.length=0}
function spawnKits(){
 clearKits();const n=Math.min(4,1+Math.floor(wave/3)+(Math.random()<.5?1:0));
 for(let i=0;i<n;i++){
  const g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(.6,.45,.6),kitM.w));
  const c1=new THREE.Mesh(new THREE.BoxGeometry(.38,.47,.12),kitM.r),c2=new THREE.Mesh(new THREE.BoxGeometry(.12,.47,.38),kitM.r);g.add(c1,c2);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.5,.025,6,24),new THREE.MeshBasicMaterial({color:0x3dff7a}));ring.rotation.x=Math.PI/2;ring.position.y=-.3;g.add(ring);
  let ok=false;for(let t=0;t<30&&!ok;t++){g.position.set((Math.random()-.5)*52,0,(Math.random()-.5)*52);const x=g.position.x,z=g.position.z;collide(g.position,1);ok=Math.hypot(g.position.x-x,g.position.z-z)<.01&&Math.hypot(x-P.x,z-P.z)>5}
  g.userData.ph=Math.random()*6;g.position.y=.8;sc.add(g);kits.push(g)}
}
function animKits(dt){
 for(let i=kits.length-1;i>=0;i--){const k=kits[i];k.rotation.y+=dt*1.6;k.position.y=.8+Math.sin(now*2.5+k.userData.ph)*.15;
  if(Math.hypot(k.position.x-P.x,k.position.z-P.z)<1.4&&hp<100){hp=Math.min(100,hp+20);sc.remove(k);kits.splice(i,1);beep(660,.1,'sine',.06);setTimeout(()=>beep(990,.12,'sine',.06),90);feed('+20 HP');fH=1;hud()}}
}

function spawnBot(){
 const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xc2302a,metalness:.6,roughness:.4}),
 d=new THREE.MeshStandardMaterial({color:0x1b1d26,metalness:.7,roughness:.4}),e=new THREE.MeshBasicMaterial({color:0xff2a2a});
 g.parts=[];g.rotation.order='YXZ';
 const body=new THREE.Group(),headG=new THREE.Group(),armL=new THREE.Group(),armR=new THREE.Group();
 body.position.y=0;headG.position.y=0;armL.position.set(-.58,1.5,0);armR.position.set(.58,1.5,0);
 g.add(body);body.add(headG);g.add(armL,armR);
 const pt=(w,h,z,mat,px,py,pz,head,par)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,z),mat);o.position.set(px,py,pz);o.castShadow=true;o.userData={bot:g,head:head};(par||(head?headG:body)).add(o);g.parts.push(o);return o};
 pt(.85,1,.5,m,0,1,0);pt(.4,.14,.05,e,0,1.2,.26);pt(.9,.2,.55,d,0,.55,0);
 pt(.5,.44,.46,d,0,1.75,0,1);pt(.38,.1,.05,e,0,1.77,.24,1);pt(.04,.3,.04,d,.15,2.1,0,1);pt(.08,.08,.08,e,.15,2.28,0,1);
 pt(.3,.2,.42,m,0,0,0,0,armL);pt(.3,.2,.42,m,0,0,0,0,armR);pt(.2,.8,.22,d,0,-.5,0,0,armL);pt(.2,.8,.22,d,0,-.5,0,0,armR);
 g.legs=[pt(.3,.55,.35,d,-.22,.28,0,0,g),pt(.3,.55,.35,d,.22,.28,0,0,g)];
 const rr=Math.random(),role=wave<2||rr<.55?'grunt':rr<.78?'rusher':'sniper',RL={grunt:{lo:6,hi:12,spd:1,hp:1,dmg:1,cd:1,col:0xc2302a},rusher:{lo:2.5,hi:6,spd:1.35,hp:.7,dmg:.8,cd:.8,col:0xff7a1a},sniper:{lo:14,hi:22,spd:.8,hp:.8,dmg:1.6,cd:1.7,col:0x9a3cff}}[role];
 g.role=role;g.R=RL;m.color.setHex(RL.col);g.vx=g.vz=0;g.side=Math.random()<.5?-1:1;g.strT=1+Math.random()*2;g.los=false;g.losT=Math.random()*.2;g.hit=0;g.cover=null;g.stuck=0;g.lx=0;g.lz=0;g.lastHp=0;
 g.body=body;g.headG=headG;g.arms=[armL,armR];g.eyes=e;g.sp=0;g.rc=0;g.dying=0;
 g.mat=m;g.dead=false;g.hp=g.mx=Math.round((50+wave*10)*RL.hp);g.bar=new THREE.Group();g.fill=new THREE.Mesh(new THREE.PlaneGeometry(.86,.06),new THREE.MeshBasicMaterial({color:0x3dff7a}));g.fill.position.z=.01;g.bar.add(new THREE.Mesh(new THREE.PlaneGeometry(.9,.1),new THREE.MeshBasicMaterial({color:0x111111})),g.fill);g.bar.position.y=2.55;g.add(g.bar);g.scale.setScalar(.01);g.cd=(1.5+Math.random()*2)*RL.cd;g.fl=0;g.ph=Math.random()*6;g.id=botId++;
 const an=Math.random()*6.283;g.position.set(Math.cos(an)*24,0,Math.sin(an)*24);collide(g.position,.6);collide(g.position,.6);
 sc.add(g);bots.push(g)}
function startWave(){wave++;spawnKits();toSpawn=3+wave*2;waiting=false;say('Wave '+wave);hud()}
let activeRunId=null,runStartedAt=0,runCoinsEarned=0,runXpEarned=0,wavesCleared=0,runFinishing=false;
async function play(){if(!cu)return;if(window.tradeLock){toast('Finish your trade first');return;}
 if(playing&&paused){paused=false;$('menu').style.display='none';lock();return;}
 try{
  let ticket;
  try{ticket=await cloud.action('/api/run/start',{})}
  catch(startError){
   if(!String(startError.message||'').includes('A run is already active'))throw startError;
   const ok=confirm('A previous run ticket is stuck on your account. Recover it and start a new run? The old unfinished run will be abandoned without rewards, including in any other open tab.');
   if(!ok)return;
   await cloud.action('/api/run/recover',{});
   ticket=await cloud.action('/api/run/start',{});
  }
  activeRunId=ticket.runId;runStartedAt=Date.now();
 }catch(e){toast(e.message||'Could not start a secure run');return;}
 bots.forEach(b=>sc.remove(b));bots.length=0;dead.forEach(b=>sc.remove(b));dead.length=0;clearKits();swapT=0;jy=jv=landT=0;
 st={c:S.coins,xp:S.xp||0};runCoinsEarned=0;runXpEarned=0;wavesCleared=0;runFinishing=false;P.set(0,0,0);yaw=pitch=0;hp=100;wave=0;kills=0;nwT=0;playing=true;paused=false;
 $('menu').style.display='none';$('hud').style.display='block';applyGun();startWave();lock()}
function startMultiplayerGame(spawn){
 if(playing&&!paused){toast('Finish your current game first');return false;}
 bots.forEach(b=>sc.remove(b));bots.length=0;dead.forEach(b=>sc.remove(b));dead.length=0;clearKits();toSpawn=-1;waiting=false;wave=1;kills=0;hp=100;next=0;kick=0;jy=jv=landT=0;P.set(Number(spawn?.x)||0,0,Number(spawn?.z)||0);yaw=Number(spawn?.yaw)||0;pitch=0;playing=true;paused=false;window.cmMpMode=true;$('menu').style.display='none';$('hud').style.display='block';applyGun();hud();lock();return true;
}
function stopMultiplayerGame(){window.cmMpMode=false;playing=false;paused=false;down=false;try{document.exitPointerLock()}catch(e){}$('hud').style.display='none';}
window.CMApp={get S(){return S},get tab(){return tab},get cu(){return cu},get player(){return P},get scene(){return sc},get camera(){return cam},get yaw(){return yaw},set yaw(v){yaw=v},get pitch(){return pitch},set pitch(v){pitch=v},get playing(){return playing},get paused(){return paused},startMultiplayerGame,stopMultiplayerGame,applyServerPlayer,drawTracer:tracer,menu,toast,showMenu,feed};
function lock(){try{const p=cv.requestPointerLock();if(p&&p.catch)p.catch(()=>fallback=true)}catch(e){fallback=true}}
function go(){if(playing&&paused){paused=false;$('menu').style.display='none';lock()}else play()}
function pause(){if(!playing||paused)return;paused=true;down=false;$('sub').textContent='Paused';menu();$('menu').style.display='flex'}
async function over(){if(!playing||runFinishing)return;playing=false;runFinishing=true;down=false;try{document.exitPointerLock()}catch(e){}
 const submitted={kills,wave,wavesCleared};
 try{
  if(!activeRunId)throw new Error('Secure run ticket missing');
  const result=await cloud.action('/api/run/finish',{runId:activeRunId,...submitted});
  applyServerPlayer(result.player);activeRunId=null;
  const reward=result.reward||{};const nb=(result.player.best||0)>=wave;
  $('hud').style.display='none';
  $('rs').innerHTML=`<h2>RUN COMPLETE</h2><div class="stats"><div><b>${result.accepted?.wave??wave}</b>Wave reached</div><div><b>${result.accepted?.kills??0}</b>Verified kills</div><div><b>+${reward.coins||0}</b>KittyCoins</div><div><b>+${reward.xp||0}</b>XP</div></div><p class="run-security-note">Rewards validated by CrateMaster servers.</p><div class="row" style="justify-content:center"><button class="big" onclick="closeRs();play()">PLAY AGAIN</button><button onclick="closeRs();showMenu()">Menu</button></div>`;
  $('results').style.display='flex';
 }catch(e){activeRunId=null;$('hud').style.display='none';$('rs').innerHTML=`<h2>RUN NOT SAVED</h2><p>${String(e.message||'The server could not verify this run.')}</p><div class="row" style="justify-content:center"><button onclick="closeRs();showMenu()">Menu</button></div>`;$('results').style.display='flex';toast('No rewards were added because the run could not be verified.');}
 finally{runFinishing=false;runCoinsEarned=0;runXpEarned=0;wavesCleared=0;}
}
function hurt(d){if(!playing)return;hp-=d;fT=1;beep(90,.15,'sawtooth',.08);hud();if(hp<=0)over()}
const tg=new THREE.BoxGeometry(.025,.025,1);function tracer(a,b,col){const l=new THREE.Mesh(tg,new THREE.MeshBasicMaterial({color:col||0xffe9a0}));l.position.copy(a).lerp(b,.5);l.lookAt(b);l.scale.z=a.distanceTo(b);l.life=.07;sc.add(l);tr.push(l)}

function defeatBotOnce(g,headshot){
 // A multi-pellet weapon may raycast the same bot more than once in one frame.
 // Mark it dead before touching the active list so later pellets cannot process it again.
 if(!g||g.dead)return false;
 const index=bots.indexOf(g);
 if(index<0)return false; // Never allow splice(-1, 1) to remove a different living bot.
 g.dead=true;g.hp=0;bots.splice(index,1);
 burst(new THREE.Vector3(g.position.x,1.1,g.position.z),34,1,8);
 burst(new THREE.Vector3(g.position.x,1.5,g.position.z),10,2,6);
 if(g.bar)g.bar.visible=false;g.dying=.001;if(g.eyes)g.eyes.color.setHex(0x331111);
 dead.push(g);kills++;runCoinsEarned+=15;runXpEarned+=10;
 feed(headshot?'HEADSHOT':'KILL +15');hud();return true;
}
function shoot(){
 if(window.cmMpMode){const MG=GUNS[S.gun];if(!MG||now<next)return;next=now+Math.max(.12,MG.f||.24);kick=.09;flashM.material.opacity=1;flashM.rotation.z=Math.random()*6;mLight.intensity=4;beep(S.gun==='sniper'?120:S.gun==='shotgun'?90:240,.08,'square',.05);if(window.cmMpShoot)window.cmMpShoot();return;}
 if(now<next)return;const G=GUNS[S.gun];if(!G)return;next=now+G.f;kick=.09;flashM.material.opacity=1;flashM.rotation.z=Math.random()*6;mLight.intensity=4;
 beep(S.gun=='sniper'?120:S.gun=='shotgun'?90:240,.08,'square',.05);
 const mz=cam.localToWorld(new THREE.Vector3(.33,-.29,-1));
 for(let i=0;i<G.p;i++){
  // Rebuild active targets per pellet: dead bots disappear immediately from hit testing.
  const targets=solid.concat(...bots.map(b=>b.parts));
  rc.far=100;rc.setFromCamera(new THREE.Vector2((Math.random()-.5)*G.s*4,(Math.random()-.5)*G.s*4),cam);
  const h=rc.intersectObjects(targets,false)[0];
  tracer(mz,h?h.point:rc.ray.at(60,new THREE.Vector3()));if(h){const bt=h.object.userData.bot;burst(h.point,bt?7:4,bt?1:0,bt?4:3);if(!bt&&h.face)decal(h.point,h.face.normal)}
  if(h&&h.object.userData.bot){
   const g=h.object.userData.bot,hs=h.object.userData.head;
   if(g.dead||!bots.includes(g))continue;
   g.hp-=G.d*(hs?2:1);g.fl=.08;hmT=.15;beep(hs?900:600,.05,'sine',.05);
   if(g.hp<=0)defeatBotOnce(g,!!hs);
  }
 }
}

function update(dt){
 if(keys.ArrowLeft)yaw+=2*dt;if(keys.ArrowRight)yaw-=2*dt;
 if(keys.ArrowUp)pitch=Math.min(1.4,pitch+1.5*dt);if(keys.ArrowDown)pitch=Math.max(-1.4,pitch-1.5*dt);
 const canMove=!(window.cmMpMode&&window.cmMpAlive===false),f=canMove?((keys.KeyW?1:0)-(keys.KeyS?1:0)):0,r=canMove?((keys.KeyD?1:0)-(keys.KeyA?1:0)):0,l=Math.hypot(f,r)||1,sp=(keys.ShiftLeft?10:7)*dt;
 P.x+=(-Math.sin(yaw)*f+Math.cos(yaw)*r)/l*sp;P.z+=(-Math.cos(yaw)*f-Math.sin(yaw)*r)/l*sp;collide(P,.4);
 if(f||r)bob+=dt*10;cam.fov+=((keys.ShiftLeft&&(f||r)?82:75)-cam.fov)*Math.min(1,dt*8);cam.updateProjectionMatrix();
 if(keys.Space&&jy===0&&jv===0){jv=7.6;beep(300,.08,'sine',.03)}
 if(jy>0||jv!==0){jv-=22*dt;jy+=jv*dt;if(jy<=0){jy=0;if(jv<-6){landT=Math.min(1,-jv/12);beep(110,.08,'sine',.05)}jv=0}}
 landT=Math.max(0,landT-dt*5);
 cam.position.set(P.x+(Math.random()-.5)*fT*.15,1.6+jy+(jy>0?0:Math.sin(bob)*.04)-landT*.12+(Math.random()-.5)*fT*.1,P.z);cam.rotation.set(pitch,yaw,0);if(window.cmMpMode&&window.cmMpTick)window.cmMpTick(dt);
 kick=Math.max(0,kick-dt*.6);swapT=Math.max(0,swapT-dt*4);const mv=(f||r)?1:0,spr=keys.ShiftLeft&&mv;const kk=1-Math.exp(-dt*7);tR+=(r-tR)*kk;sA+=((spr?1:0)-sA)*kk;
 gun.position.set(.33+Math.cos(bob*.5)*.012*mv+sA*.0025,-.31+Math.abs(Math.sin(bob))*.012*mv-swapT*.35-sA*.004-jv*.006+landT*.05,-.5+kick);
 gun.rotation.x=kick*2+swapT*.9+sA*.02;gun.rotation.y=sA*.0125+Math.cos(bob*.5)*.015*mv;gun.rotation.z=Math.sin(bob*.5)*.02*mv-tR*.01;
 cam.rotation.z=-tR*.0045+(Math.random()-.5)*fT*.03;cam.position.y+=fH*.03*Math.sin(now*30);fH=Math.max(0,fH-dt*3);
 if(down&&GUNS[S.gun].a)shoot();
 /* spawning & waves */
 if(toSpawn>0){spT-=dt;if(spT<=0){spawnBot();toSpawn--;spT=.8}}
 else if(toSpawn===0&&bots.length===0&&!waiting){waiting=true;nwT=3;const b=20+wave*5;runCoinsEarned+=b;runXpEarned+=25;wavesCleared++;hp=Math.min(100,hp+30);say(`Wave ${wave} cleared! +${b} KittyCoins (pending)`);hud()}
 if(waiting){nwT-=dt;if(nwT<=0)startWave()}
 animDead(dt);animKits(dt);
 /* bots */
 for(const g of bots){
  const d=aiBot(g,dt);
  g.fl=Math.max(0,g.fl-dt);g.ph+=dt*7;g.fill.scale.x=Math.max(.001,g.hp/g.mx);g.fill.position.x=-.43*(1-g.fill.scale.x);g.mat.emissive.setHex(g.fl>0?0xaa3322:0);
  animBot(g,dt,d);
  aiShoot(g,dt,d);
 }
radar();$('xh').style.setProperty('--sp',(6+kick*40+((keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD)?6:0))+'px');flashM.material.opacity=Math.max(0,flashM.material.opacity-dt*14);mLight.intensity=Math.max(0,mLight.intensity-dt*40);
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];p.life-=dt;if(p.life<=0){sc.remove(p);pts.splice(i,1);continue}p.v.y-=14*dt;p.position.addScaledVector(p.v,dt);if(p.position.y<.04){p.position.y=.04;p.v.multiplyScalar(.3)}p.scale.setScalar(p.life/p.max)}
 for(let i=tr.length-1;i>=0;i--){const t=tr[i];t.life-=dt;if(t.life<=0){sc.remove(t);t.material.dispose();tr.splice(i,1)}}
 hmT=Math.max(0,hmT-dt);$('hm').style.opacity=hmT>0?1:0;
 fT=Math.max(0,fT-dt*2);$('flash').style.opacity=fT;if(fxp)fxp.uniforms.h.value=fT;
 mT=Math.max(0,mT-dt);
}

/* ---------- input ---------- */
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===cv;if(!locked&&playing&&!paused&&!fallback){if(window.cmMpMode){fallback=true;return;}pause()}});
document.addEventListener('pointerlockerror',()=>{fallback=true});
addEventListener('mousemove',e=>{if(!playing||paused)return;if(locked||(fallback&&down)){yaw-=e.movementX*.0025*(S.sens||1);pitch=Math.max(-1.4,Math.min(1.4,pitch-e.movementY*.0025*(S.sens||1)))}});
addEventListener('mousedown',e=>{if(!playing||paused||e.button)return;down=true;shoot()});
addEventListener('mouseup',()=>down=false);
function selectHotbarSlot(si){const g=S.hot[si];if(!g||!GUNS[g])return false;S.gun=g;curSlot=si;applyGun();return true}
function cycleHotbar(direction){
 const slots=S.hot.map((g,i)=>g&&GUNS[g]?i:-1).filter(i=>i>=0);if(!slots.length)return;
 let at=slots.indexOf(curSlot);if(at<0||S.hot[curSlot]!==S.gun)at=slots.findIndex(i=>S.hot[i]===S.gun);if(at<0)at=0;
 const next=slots[(at+direction+slots.length)%slots.length];selectHotbarSlot(next);
}
addEventListener('keydown',e=>{keys[e.code]=true;
 if(e.code=='Escape'&&!window.cmMpMode)pause();
 if(playing&&!paused&&/^Digit[1-5]$/.test(e.code))selectHotbarSlot(+e.code[5]-1)});
addEventListener('wheel',e=>{if(!playing||paused)return;e.preventDefault();cycleHotbar(e.deltaY>0?1:-1)},{passive:false});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;down=false;if(playing&&!paused&&!window.cmMpMode)pause()});

/* ---------- main loop ---------- */
/* ---------- cloud (Firebase auth + Firestore) + mandatory login gate ---------- */
const DEF=()=>({coins:250,gems:0,webCredits:0,multiplayerWins:0,multiplayerLosses:0,multiplayerKills:0,multiplayerHeadshots:0,adminKeys:0,discoveredGuns:['pistol'],indexGemMilestones:0,guns:['pistol'],skins:['default'],gun:'pistol',skin:'default',best:0,kills:0,xp:0,runs:0,sens:1,vol:1,bloom:true,nick:'',hot:['pistol']});
const hasGunId=id=>typeof id==='string'&&Object.prototype.hasOwnProperty.call(GUNS,id);
const hasSkinId=id=>typeof id==='string'&&Object.prototype.hasOwnProperty.call(SKINS,id);
function clean(d){
 d=d||{};const o=DEF();
 ['coins','webCredits','multiplayerWins','multiplayerLosses','multiplayerKills','multiplayerHeadshots','best','kills','xp','runs'].forEach(k=>o[k]=Math.max(0,Math.floor(+d[k]||0)));
 // Only the 500 catalogue IDs are accepted. Unknown/retired IDs are discarded.
 const rawGuns=Array.isArray(d.guns)?d.guns.slice():[];
 if(hasGunId(d.gun)&&!rawGuns.includes(d.gun))rawGuns.push(d.gun);
 o.guns=['pistol',...rawGuns.filter(g=>hasGunId(g)&&g!=='pistol')];
 const rawSkins=Array.isArray(d.skins)?d.skins.slice():[];
 if(hasSkinId(d.skin)&&!rawSkins.includes(d.skin))rawSkins.push(d.skin);
 o.skins=['default',...rawSkins.filter(k=>hasSkinId(k)&&k!=='default')];
 if(o.guns.includes(d.gun))o.gun=d.gun;
 if(o.skins.includes(d.skin))o.skin=d.skin;
 if(d.sens>0)o.sens=+d.sens;
 if(d.vol>=0&&d.vol<=1)o.vol=+d.vol;
 o.bloom=d.bloom!==false;o.nick=cleanNick(d.username);
 if(Array.isArray(d.hotbar))o.hot=d.hotbar.slice(0,5).map(g=>hasGunId(g)?g:'');
 else o.hot=o.guns.slice(0,5);
 o.hot=fixHot(o.hot,o.guns);
 o.gems=Math.max(0,Math.floor(Number(d.gems)||0));
 o.adminKeys=Math.max(0,Math.floor(Number(d.adminKeys)||0));
 const seen=new Set((Array.isArray(d.discoveredGuns)?d.discoveredGuns:[]).filter(hasGunId));
 for(const id of o.guns)seen.add(id);
 o.discoveredGuns=[...seen];
 o.indexGemMilestones=Math.max(0,Math.floor(Number(d.indexGemMilestones)||0));
 return o;
}
function gate(st){$('gate').style.display=st=='off'?'none':'flex';$('g-load').style.display=st=='load'?'block':'none';$('g-btns').style.display=st=='login'?'flex':'none'}
function signIn(){$('g-err').textContent='';if(!window.cloud){$('g-err').textContent='Login is unavailable right now. Check your connection and reload the page.';return}
 cloud.login().catch(e=>{$('g-err').textContent='Sign-in failed: '+(e.code||e.message)})}
addEventListener('cm-auth',async e=>{const was=cu;cu=e.detail;gateDone=true;
 if(cu){
  try{const boot=await cloud.bootstrap();if(boot&&boot.events)ev=boot.events;const d=await cloud.load();if(d)S=clean(d);else throw new Error('Server did not initialize your player save');cloud.save(S,true);sync='synced';setTimeout(()=>loadMail(true),1200)}
  catch(err){console.error(err);$('g-err').textContent='Could not load your save ('+(err.code||err.message)+'). Check your connection and sign in again.';cloud.logout();return}
  gate('off');showMenu();refreshLim()}
 else{if(was){S=DEF();playing=false;paused=false;down=false;$('hud').style.display='none';closeRs();$('reveal').style.display='none';rolling=false}
  $('menu').style.display='none';gate('login')}
 applyGun();menu()});
addEventListener('cm-sync',e=>{sync=e.detail=='ok'?'saved':'save failed';if(!playing||paused)menu()});
gate('load');setTimeout(()=>{if(!gateDone){gate('login');$('g-err').textContent=window.cloud?'Still connecting… try signing in.':'Login is unavailable right now. Check your connection and reload the page.'}},4500);

let last=performance.now(),lastMenuFrame=0,lastGameFrame=0;
function loop(t){requestAnimationFrame(loop);
 const menuMode=!playing||paused;
 const minFrame=1000/(menuMode?activeQuality.menuFps:activeQuality.maxFps);
 const previousFrame=menuMode?lastMenuFrame:lastGameFrame;
 if(t-previousFrame<minFrame)return;
 if(menuMode)lastMenuFrame=t;else lastGameFrame=t;
 const dt=Math.min((t-last)/1000,.05);last=t;now=t/1000;
 for(const r of rings)r.rotation.z+=dt*(r.k?-1.2:1.2);dust.rotation.y+=dt*.02;
 if(playing&&!paused)update(dt);
 else if(!playing){cam.position.set(0,7,0);cam.rotation.set(-.35,cam.rotation.y+dt*.15,0)}
 // Menus do not need the expensive bloom post-processing chain or 60 FPS rendering.
 if(menuMode){ren.render(sc,cam);return}
 if(comp&&S.bloom!==false&&activeQuality.post){fxp.uniforms.t.value=now%100;comp.render()}else ren.render(sc,cam)}
applyGun();menu();requestAnimationFrame(loop);

/* ---------- Mailbox ---------- */
let mailData=null,mailItems=[],mailBusy=false;
const mailNum=n=>Number(n||0).toLocaleString();
const mailWhen=ms=>new Date(ms).toLocaleDateString(undefined,{day:'numeric',month:'short'})+' '+new Date(ms).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
function mailItemName(type,id){const o=(type==='guns'?GUNS:SKINS)[id];return o?o.n:id}
function mailChips(m){
 const c=[];
 if(m.coins)c.push(`<span class="mb"><i class="coin"></i>${mailNum(m.coins)}</span>`);
 if(m.gems)c.push(`<span class="mb"><i class="gem-icon"></i>${mailNum(m.gems)}</span>`);
 if(m.adminKeys)c.push(`<span class="mb key">🗝 ${mailNum(m.adminKeys)} Admin Key${m.adminKeys===1?'':'s'}</span>`);
 const count=a=>{const o={};(a||[]).forEach(x=>o[x]=(o[x]||0)+1);return o};
 for(const [id,n] of Object.entries(count(m.guns)))c.push(`<span class="mb" style="--c:${GUNS[id]?rankColorOf(GUNS[id]):'#999'}">${gemRollEsc(mailItemName('guns',id))}${n>1?' ×'+n:''}</span>`);
 for(const [id,n] of Object.entries(count(m.skins)))c.push(`<span class="mb">${gemRollEsc(mailItemName('skins',id))}${n>1?' ×'+n:''} <small>skin</small></span>`);
 return c.join('')||'<span class="mb muted">Message only</span>';
}
function renderMail(){
 if(!$('mail-inbox'))return;
 const m=mailData;
 if(!cu){$('mail-inbox').innerHTML='<p class="note">Sign in to use the mailbox.</p>';return}
 if(!m){$('mail-inbox').innerHTML='<p class="note">Loading…</p>';return}
 const badge=$('mail-badge');if(badge){badge.textContent=m.unclaimed||'';badge.style.display=m.unclaimed?'inline-block':'none'}
 $('mail-count').textContent=m.unclaimed?`· ${m.unclaimed} new`:'';
 $('mail-claim-all').style.display=m.unclaimed>1?'':'none';
 $('mail-inbox').innerHTML=m.inbox.length?m.inbox.map(x=>`<div class="mailitem ${x.claimed?'done':''}"><div class="mailitem-top"><b>From ${gemRollEsc(x.fromName)}</b><small>${mailWhen(x.createdAtMs)}</small></div>${x.message?`<p>${gemRollEsc(x.message)}</p>`:''}<div class="mbs">${mailChips(x)}</div>${x.claimed?'<small class="muted">Claimed</small>':`<button class="sm" onclick="claimMailItem('${x.id}')">Claim</button>`}</div>`).join(''):'<p class="note">Your mailbox is empty.</p>';
 $('mail-sent').innerHTML=m.sent.length?m.sent.map(x=>`<div class="mailitem ${x.claimed?'done':''}"><div class="mailitem-top"><b>To ${gemRollEsc(x.toName)}</b><small>${mailWhen(x.createdAtMs)}</small></div>${x.message?`<p>${gemRollEsc(x.message)}</p>`:''}<div class="mbs">${mailChips(x)}</div><small class="muted">${x.claimed?'Claimed by the player':'Waiting to be claimed'}</small></div>`).join(''):'<p class="note">Nothing sent yet.</p>';
 const kw=$('mail-keys-wrap');if(kw)kw.style.display=(m.canSendKeys||Number(S.adminKeys||0)>=1)?'':'none'; // hidden unless you own keys
 renderMailPicker();
}
function renderMailPicker(){
 const sel=$('mail-pick');if(!sel)return;
 const used={};mailItems.forEach(i=>{const k=i.type+':'+i.id;used[k]=(used[k]||0)+1});
 const opts=[];
 const grp={};S.guns.forEach(id=>{if(GUNS[id]&&id!=='pistol')grp[id]=(grp[id]||0)+1});
 Object.keys(grp).sort(gSort).forEach(id=>{const left=grp[id]-(used['guns:'+id]||0);if(left>0)opts.push(`<option value="guns:${id}">${gemRollEsc(GUNS[id].n)} · ${rankLabelOf(GUNS[id])}${grp[id]>1?' (×'+left+')':''}</option>`)});
 const sk={};S.skins.forEach(id=>{if(SKINS[id]&&id!=='default')sk[id]=(sk[id]||0)+1});
 Object.keys(sk).forEach(id=>{const left=sk[id]-(used['skins:'+id]||0);if(left>0)opts.push(`<option value="skins:${id}">Skin: ${gemRollEsc(SKINS[id].n)}${sk[id]>1?' (×'+left+')':''}</option>`)});
 sel.innerHTML='<option value="">Choose an item…</option>'+opts.join('');
 $('mail-attached').innerHTML=mailItems.map((i,n)=>`<span class="mb">${gemRollEsc(mailItemName(i.type,i.id))} <button class="x" onclick="mailRemoveItem(${n})" aria-label="Remove">✕</button></span>`).join('');
}
function mailAddItem(){
 const v=$('mail-pick').value;if(!v)return;
 if(mailItems.length>=10){toast('At most 10 items per mail');return}
 const [type,id]=v.split(':');mailItems.push({type,id});renderMailPicker();
}
function mailRemoveItem(n){mailItems.splice(n,1);renderMailPicker()}
async function loadMail(silent){
 if(!cloud||!cu||mailBusy)return renderMail();
 mailBusy=true;
 try{
  const res=await cloud.action('/api/mail/inbox');
  mailData=res;
  if(res.player&&!playing)applyServerPlayer(res.player);
  renderMail();
 }catch(e){if(!silent)toast(e.message||'Could not load your mailbox')}
 finally{mailBusy=false}
}
async function mailLookup(){
 const st=$('mail-to-status'),name=$('mail-to').value.trim();
 if(!name){st.textContent='Type a username first.';st.className='mail-status bad';return}
 st.textContent='Checking…';st.className='mail-status';
 try{const r=await cloud.action('/api/mail/lookup',{name});st.textContent='✓ Player found: '+r.name;st.className='mail-status ok'}
 catch(e){st.textContent=e.message||'Not found';st.className='mail-status bad'}
}
async function sendMailForm(){
 if(!cloud||!cu){toast('Sign in first');return}
 const btn=$('mail-send'),to=$('mail-to').value.trim();
 if(!to){toast('Type the username of the player');return}
 const body={to,message:$('mail-msg').value,coins:+$('mail-coins').value||0,gems:+$('mail-gems').value||0,items:mailItems};
 const keysVisible=$('mail-keys-wrap')&&$('mail-keys-wrap').style.display!=='none';
 if(keysVisible)body.adminKeys=+$('mail-keys').value||0;
 if(body.adminKeys&&!(mailData&&mailData.canSendKeys)&&body.adminKeys>Number(S.adminKeys||0)){toast('You do not have that many Admin Keys');return}
 if(body.coins>S.coins){toast('You do not have that many KittyCoins');return}
 if(body.gems>S.gems){toast('You do not have that many KittyGems');return}
 const total=[body.coins?mailNum(body.coins)+' coins':'',body.gems?mailNum(body.gems)+' gems':'',mailItems.length?mailItems.length+' item(s)':'',body.adminKeys?body.adminKeys+' Admin Key(s)':''].filter(Boolean).join(', ');
 if(total&&!confirm(`Send ${total} to ${to}? This cannot be undone.`))return;
 btn.disabled=true;btn.textContent='SENDING…';
 try{
  const res=await cloud.action('/api/mail/send',body);
  applyServerPlayer(res.player);
  toast('Mail sent to '+res.sentTo);
  mailItems=[];['mail-msg'].forEach(i=>$(i).value='');['mail-coins','mail-gems','mail-keys'].forEach(i=>{if($(i))$(i).value=0});
  menuCache.inv=null;updateWallet();menu();mailBusy=false;await loadMail(true);
 }catch(e){toast(e.message||'Could not send the mail')}
 finally{btn.disabled=false;btn.textContent='SEND MAIL'}
}
async function claimMailItem(id,quiet){
 try{
  const res=await cloud.action('/api/mail/claim',{id});
  applyServerPlayer(res.player);
  if(!quiet){const c=res.claimed||{};toast('Claimed'+(c.coins?` · +${mailNum(c.coins)} coins`:'')+(c.gems?` · +${mailNum(c.gems)} gems`:'')+((c.guns||[]).length+(c.skins||[]).length?` · ${(c.guns||[]).length+(c.skins||[]).length} item(s)`:'')+(c.adminKeys?` · +${c.adminKeys} Admin Key(s)`:'')+(res.indexGems?` · Index bonus +${res.indexGems} gems`:''))}
  menuCache.inv=null;menuCache.skins=null;menuCache.index=null;updateWallet();
  if(!quiet){mailBusy=false;await loadMail(true);menu()}
 }catch(e){toast(e.message||'Could not claim');if(!quiet){mailBusy=false;loadMail(true)}}
}
async function claimAllMail(){
 if(!mailData)return;
 const ids=mailData.inbox.filter(x=>!x.claimed).map(x=>x.id);
 for(const id of ids)await claimMailItem(id,true);
 toast(`Claimed ${ids.length} mails`);mailBusy=false;await loadMail(true);menu();
}
setInterval(()=>{if(cu&&!playing&&!document.hidden)loadMail(true)},60000);
