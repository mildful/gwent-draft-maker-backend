export type ToEntity<M, E> = {
  (model: M): E;
  <OmitId extends true>(model: M): Omit<E, 'id'>;
};

export default interface BaseSerializer<M, E> {
  toEntity: ToEntity<M, E>;
  toModel: (entity: E) => M;
}
