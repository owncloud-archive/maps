<?php
namespace OCA\Maps\Db;

use OCP\AppFramework\Db\Entity;

class Favorite extends Entity {
	public $lat;
	public $lng;
	public $timestamp;
	public $name;
	public $userId;
}
