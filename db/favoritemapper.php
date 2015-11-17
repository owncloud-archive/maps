<?php
namespace OCA\Maps\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

class LocationMapper extends Mapper {

	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'maps_favorites', '\OCA\Maps\Db\Favorite');
	}

	/**
	 * @param int $id
	 * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
	 * @return Favorite
	 */
	public function find($id) {
		$sql = 'SELECT * FROM `*PREFIX*maps_favorites` '.
			'WHERE `id` = ?';
		return $this->findEntity($sql, [$id]);
	}

	/**
	 * @param string $userId
	 * @param string $from
	 * @param string $until
	 * @param int $limit
	 * @param int $offset
	 * @return Favorite[]
	 */
	public function findBetween($userId, $from, $until, $limit=null, $offset=null) {
		$sql = 'SELECT * FROM `*PREFIX*maps_favorites` '.
			'WHERE `userId` = ?'.
			'AND `timestamp` BETWEEN ? and ?';
		return $this->findEntities($sql, [$userId, $from, $until], $limit, $offset);
	}

	/**
	 * @param int $limit
	 * @param int $offset
	 * @return Favorite[]
	 */
	public function findAll($limit=null, $offset=null) {
		$sql = 'SELECT * FROM `*PREFIX*maps_favorites`';
		return $this->findEntities($sql, $limit, $offset);
	}
}
