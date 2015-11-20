<?php
/**
 * ownCloud - maps
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Sander Brand <brantje@gmail.com>
 * @copyright Sander Brand 2014
 */

namespace OCA\Maps\Controller;

use \OCA\Maps\Db\DeviceMapper;
use \OCP\IRequest;
use \OCP\AppFramework\Http\TemplateResponse;
use \OCP\AppFramework\Controller;
use \OCA\Maps\Db\CacheManager;
use \OCP\Files\Folder;
use \OCP\Files\IRootFolder;

class PageController extends Controller {

	private $userId;
	private $cacheManager;
	private $rootF;
	private $deviceMapper;
	public function __construct($appName, IRequest $request, $rootF, $userId,
								CacheManager $cacheManager,
								DeviceMapper	$deviceMapper) {
		parent::__construct($appName, $request);
		$this -> userId = $userId;
		$this -> cacheManager = $cacheManager;
		$this -> deviceMapper = $deviceMapper;
		$this -> rootF = $rootF;
	}

	/**
	 * CAUTION: the @Stuff turn off security checks, for this page no admin is
	 *          required and no CSRF check. If you don't know what CSRF is, read
	 *          it up in the docs or you might create a security hole. This is
	 *          basically the only required method to add this exemption, don't
	 *          add it to any other method if you don't exactly know what it does
	 *
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index() {

		$params = array('user' => $this -> userId,'devices'=>$this->deviceMapper->findAll($this->userId));
		$response = new TemplateResponse('maps', 'main', $params);
		if (class_exists('OCP\AppFramework\Http\ContentSecurityPolicy')) {
			$csp = new \OCP\AppFramework\Http\ContentSecurityPolicy();
			// map tiles
			$csp->addAllowedImageDomain('http://*.mqcdn.com');
			// marker icons
			$csp->addAllowedImageDomain('https://api.tiles.mapbox.com');
			// inline images
			$csp->addAllowedScriptDomain('data:');
			$response->setContentSecurityPolicy($csp);
		}
		return $response;
		// templates/main.php
	}

	/**
	 * Get an layer
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getlayer() {
		$layer = ($this -> params('layer')) ? $this -> params('layer') : null;
		if ($layer === "contacts") {
			if (\OCP\App::isEnabled('contacts')) {

			} else {
				OCP\Util::writeLog('maps', "App contacts missing for Maps", \OCP\Util::WARN);
			}
		}
	}

	/**
	 * Simply method that posts back the payload of the request
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function doProxy($echo) {
		$url = ($this -> params('url')) ? $this -> params('url') : '';
		$allowedHosts = array('overpass.osm.rambler.ru', 'overpass-api.de', 'dev.virtualearth.net', 'router.project-osrm.org', 'nominatim.openstreetmap.org', 'maps.googleapis.com');
		$parseUrl = parse_url($url);

		if (in_array($parseUrl['host'], $allowedHosts)) {
			header('Content-Type: application/javascript');
			$split = explode('url=', $_SERVER['REQUEST_URI']);
			echo $this -> getURL($split[1]);
		}
		die();
	}

	/**
	 * Simply method that posts back the payload of the request
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function search() {
		$cm = \OC::$server -> getContactsManager();
		$kw = $this -> params('search');
		$bbox = $this -> params('bbox');
		$response = array('contacts'=>array(),'nodes'=>array(),'addresses'=>array());

		$contacts = $cm -> search($kw, array('FN', 'ADR'));
		foreach ($contacts as $r) {
			$data = array();
			$contact = $r;
			for($i=0; $i<count($r['ADR']); $i++){
				$lookupAdr = implode(',', array_filter($r['ADR'][$i]));
				$lookup = $this -> doAdresslookup($lookupAdr);
				$contact ['location'][] = $lookup[0];
			}
			array_push($response['contacts'],$contact);
		}
		$response['nodes'] = $this->bboxSearch($kw, $bbox);
		$addresses = $this->doAdresslookup(urlencode($kw));
		foreach($addresses as $address){
			array_push($response['addresses'],$address);
			if($address->osm_type === "node"){
			}
		}
		//$response['addresses'] = (array)($this->doAdresslookup($kw));

		return $response;
	}

	/**
	 * Simply method that posts back the payload of the request
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
  public function geodecode(){
   $lat = $this->params('lat');
   $lng = $this->params('lng');
   $zoom = $this->params('zoom');

   $hash = md5($lat.','.$lng.'@'.$zoom);

   $checkCache = $this -> checkGeoCache($hash);
  if(!$checkCache){
      $url = 'http://nominatim.openstreetmap.org/reverse/?format=json&email=brantje@gmail.com&lat='.$lat.'&lng='. $lng.'&zoom=67108864';
      $response = $this->getURL($url,false);
      if($response){
        $this -> cacheManager -> insert($hash, $response);
      }
   } else {
     $response = $checkCache;
   }
   echo $response;
   die();
  }
	/**
	 * Simply method that posts back the payload of the request
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function adresslookup() {
		//
		$street = ($this -> params('street')) ? $this -> params('street') : '';
		$city = ($this -> params('city')) ? $this -> params('city') : '';
		$country = ($this -> params('country')) ? $this -> params('country') : '';

		$q = urlencode($street . ',' . $city . ',' . $country);
		$r = (array) $this -> doAdresslookup($q);
		echo json_encode($r[0]);
		die();
	}

	private function bboxSearch($q,$bbox){
		$apiUrl = 'http://nominatim.openstreetmap.org/search?format=json&limit=100&q=' . $q . '&viewbox='.$bbox.'&bounded=1';
		//echo $apiUrl;
		$r = $this -> getURL($apiUrl, false);
		$s = (array)json_decode($r);
		return $s;
	}

	/**
	 * @param string $q
	 */
	private function doAdresslookup($q) {

		$q = str_replace(" ", "+", $q);
		$geohash = md5($q);
		$checkCache = $this -> checkGeoCache($geohash);
		if (!$checkCache) {
			//$apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='. str_replace(' ','+',$q) .'&key=AIzaSyAIHAIBv_uPKZgoxQt0ingc1gWsdAhG7So';
			//$apiUrl = 'http://nominatim.openstreetmap.org/search?format=json&street='. $street . '&city='.$city.'&country='.$country.'&limit=1';
			$apiUrl = 'http://nominatim.openstreetmap.org/search?format=json&q=' . $q;
			$r = $this -> getURL($apiUrl, false);
			$s = (array)json_decode($r);

			$r -> apiUrl = $apiUrl;
			$r = $s;
			$this -> cacheManager -> insert($geohash, $s);
		} else {
			$checkCache -> cachedResult = true;
			$r = $checkCache;
		}
		return $r;

	}

	/**
	 * @param string $hash
	 */
	private function checkGeoCache($hash) {
		return $this -> cacheManager -> check($hash);
	}

	private function getURL($url, $userAgent = true) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 900);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		if ($userAgent) {
			curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5');
		}
		curl_setopt($ch, CURLOPT_URL, $url);
		$tmp = curl_exec($ch);
		$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		if ($httpCode === 404) {
			return false;
		} else {
			if ($tmp !== false) {
				return $tmp;
			}
		}

	}

	public function getGpsFiles(){
		$path = '/' . $this->userId . '/files/MyTracks';
		if ($this->rootF->nodeExists($path)) {
			$folder = $this->rootF->get($path);
		} else {
			$folder = $this->rootF->newFolder($path);
		}
		$nodes = $folder->getDirectoryListing();
		$suffix = ".gpx";
		foreach($nodes as $n){
			if($n->getType() == \OCP\Files\FileInfo::TYPE_FILE){
				$name = $n->getName();
				if(substr_compare($name, $suffix, -strlen($suffix)) === 0){
					$arr = array();
					$arr['dir'] = $n->getParent()->getName();
					$arr['file'] = $n->getName();
					$files[] = $arr;
				}
			}
		}
		return $files;
	}
}
