import SpatialHash from "./SpatialHash";

describe('SpatialHash', () => {
  let spatialHash: SpatialHash<any>;

  beforeEach(() => {
    spatialHash = new SpatialHash<any>(10, 5);
  });

  it('should insert an entity', () => {
    const entity = {};
    spatialHash.insert(entity, 10, 20, 30, 40);
    expect(spatialHash.query(10, 20, 30, 40)).toContain(entity);
  });

  it('should update an entity', () => {
    const entity = {};
    spatialHash.insert(entity, 10, 20, 30, 40);
    spatialHash.update(entity, 50, 60, 30, 40);
    expect(spatialHash.query(10, 20, 30, 40)).not.toContain(entity);
    expect(spatialHash.query(50, 60, 30, 40)).toContain(entity);
  });

  it('should remove an entity', () => {
    const entity = {};
    spatialHash.insert(entity, 10, 20, 30, 40);
    spatialHash.remove(entity);
    expect(spatialHash.query(10, 20, 30, 40)).not.toContain(entity);
  });

  it('should return entities within a queried area', () => {
    const entity1 = {};
    const entity2 = {};
    spatialHash.insert(entity1, 10, 20, 30, 40);
    spatialHash.insert(entity2, 50, 60, 30, 40);
    const result = spatialHash.query(0, 0, 100, 100);
    expect(result).toContain(entity1);
    expect(result).toContain(entity2);
  });

  it('should return all entities', () => {
    const entity1 = {};
    const entity2 = {};
    spatialHash.insert(entity1, 10, 20, 30, 40);
    spatialHash.insert(entity2, 50, 60, 30, 40);
    const allEntities = spatialHash.getAll();
    expect(allEntities.length).toBe(2);
    expect(allEntities).toContain(entity1);
    expect(allEntities).toContain(entity2);
  });

  it('should handle an entity spanning multiple cells', () => {
    const entity = {};
    spatialHash.insert(entity, 10, 10, 100, 100); // Assumes this entity spans multiple cells
    // Query partially overlapping the entity
    expect(spatialHash.query(5, 5, 50, 50)).toContain(entity);
    // Query not overlapping the entity
    expect(spatialHash.query(200, 200, 50, 50)).not.toContain(entity);
  });

  it('should handle multiple entities in a single cell', () => {
    const entity1 = {};
    const entity2 = {};
    // Both entities in the same spatial location
    spatialHash.insert(entity1, 10, 10, 30, 30);
    spatialHash.insert(entity2, 10, 10, 30, 30);
    const results = spatialHash.query(10, 10, 30, 30);
    expect(results).toContain(entity1);
    expect(results).toContain(entity2);
    expect(results.length).toBe(2);
  });

  it('should correctly update entities spanning multiple cells', () => {
    const entity = {};
    spatialHash.insert(entity, 10, 10, 100, 100);
    spatialHash.update(entity, 110, 110, 100, 100);
    expect(spatialHash.query(10, 10, 100, 100)).not.toContain(entity);
    expect(spatialHash.query(110, 110, 100, 100)).toContain(entity);
  });

  it('should correctly remove entities spanning multiple cells', () => {
    const entity = {};
    spatialHash.insert(entity, 10, 10, 100, 100);
    spatialHash.remove(entity);
    expect(spatialHash.query(10, 10, 100, 100)).not.toContain(entity);
    expect(spatialHash.query(50, 50, 20, 20)).not.toContain(entity); // Query within the entity's previous span
  });

  it('should correctly handle queries overlapping multiple cells', () => {
    const entity1 = {};
    const entity2 = {};
    spatialHash.insert(entity1, 10, 10, 30, 30);
    spatialHash.insert(entity2, 60, 60, 30, 30);
    // Query that overlaps both entities
    const results = spatialHash.query(0, 0, 100, 100);
    expect(results).toContain(entity1);
    expect(results).toContain(entity2);
    expect(results.length).toBe(2);
  });
});
