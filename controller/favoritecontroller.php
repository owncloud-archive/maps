<?php
/**
 * ownCloud - maps
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Vinzenz Rosenkranz <vinzenz.rosenkranz@gmail.com>
 * @copyright Vinzenz Rosenkranz 2015
 */

namespace OCA\Maps\Controller;

use OCA\Maps\Db\Favorite;
use OCA\Maps\Db\FavoriteMapper;
use \OCP\IRequest;
use \OCP\AppFramework\Http\JSONResponse;
use \OCP\AppFramework\ApiController;


class FavoriteController extends ApiController {

	private $userId;
	private $favoriteMapper;

	public function __construct($appName, IRequest $request, FavoriteMapper $favoriteMapper, $userId) {
		parent::__construct($appName, $request);
		$this->favoriteMapper = $favoriteMapper;
		$this->userId = $userId;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param $lat int
	 * @param $lon int
	 * @param $timestamp string
	 * @param $name string
	 * @param $userId int
	 * @param $id int
	 * @return JSONResponse
	 */
	public function update($lat, $lon, $timestamp, $name, $userId, $id) {

		$favorite = new Favorite();
		$favorite->lat = $lat;
		$favorite->lng = $lon;
		if((string)(float)$timestamp === $timestamp) {
			if(strtotime(date('d-m-Y H:i:s',$timestamp)) === (int)$timestamp) {
				$favorite->timestamp = (int)$timestamp;
			} elseif(strtotime(date('d-m-Y H:i:s',$timestamp/1000)) === (int)floor($timestamp/1000)) {
				$favorite->timestamp = (int)floor($timestamp/1000);
			}
		} else {
			$favorite->timestamp = strtotime($timestamp);
		}
		$favorite->$name = $name;
		$favorite->$userId = $userId;
		$favorite->$id = $id;

		/* Only save favorite if it exists in db */
		try {
			$this->favoriteMapper->find($id);
			return new JSONResponse($this->favoriteMapper->insert($location));
		} catch(\OCP\AppFramework\Db\DoesNotExistException $e) {
			return new JSONResponse([
				'error' => $e->getMessage()
			]);
		}
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param $lat float
	 * @param $lon float
	 * @return JSONResponse
	 */
	public function addFavorite($lat, $lon){
		$favorite = new Favorite();
		$favorite->name = "empty";
		$favorite->timestamp = time();
		$favorite->userId = $this->userId;
		$favorite->lat = $lat;
		$favorite->lon = $lon;

		/* @var $favorite Favorite */
		$favorite = $this->favoriteMapper->insert($favorite);

		$response = array('id'=> $favorite->getId());
		return new JSONResponse($response);
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param $id int
	 * @return JSONResponse
	 */
	public function removeFavorite($id){
		/* @var $id Favorite id */
		$favorite = $this->favoriteMapper->find($id);
		if($favorite->userId == $this->userId) {
			$this->favoriteMapper->delete($id);
		}
		return new JSONResponse();
	}

}
