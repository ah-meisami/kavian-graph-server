--==============================================================================
--Detecting useful node with custome nodes and edges
--==============================================================================
select acct_src,count(*) from atm.graph_data group by acct_src order by count(*) desc;

select * from atm.graph_data where acct_src in (
    select acct_src from atm.graph_data group by acct_src having count(*)=3279
)

select * from atm.graph_data where acct_src='0201894993002' or acct_dstn='0201894993002' order by trn_date;
--==============================================================================

--==============================================================================
--Define a unique ID for each acct.
--==============================================================================
DROP TABLE ATM.GRAPH_ACCT CASCADE CONSTRAINTS;

create table atm.graph_acct (
    id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    acct VARCHAR2(50)
);

ALTER TABLE ATM.GRAPH_ACCT ADD CONSTRAINT PK_GRAPH_ACCT PRIMARY KEY(ACCT);

insert into atm.graph_acct(acct) select acct from(
select acct_src acct from atm.graph_data
union
select acct_dstn acct from atm.graph_data
);

--==============================================================================


--==============================================================================
--Create two master-detail relation between Account Source And Account Destination with Account
--==============================================================================
DROP TABLE ATM.GRAPH_DATA CASCADE CONSTRAINTS;

CREATE TABLE ATM.GRAPH_DATA(
  id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
  ACCT_SRC   VARCHAR2(50 BYTE),
  ACCT_DSTN  VARCHAR2(50 BYTE),
  TRN_CD     VARCHAR2(5 BYTE),
  TRN_DATE   NUMBER,
  TRN_AMNT   NUMBER
);

ALTER TABLE ATM.GRAPH_DATA ADD CONSTRAINT PK_GRAPH_DATA PRIMARY KEY(ID);

ALTER TABLE ATM.GRAPH_DATA ADD CONSTRAINT FK_GRAPH_DATA01 FOREIGN KEY(ACCT_SRC) REFERENCES ATM.GRAPH_ACCT(ACCT);

ALTER TABLE ATM.GRAPH_DATA ADD CONSTRAINT FK_GRAPH_DATA02 FOREIGN KEY(ACCT_DSTN) REFERENCES ATM.GRAPH_ACCT(ACCT);
--==============================================================================


--==============================================================================
--Get Distinct Nodes
--==============================================================================
--version: 1 (using rownum for id)
select rownum,node from (
select acct_src node from atm.graph_data where acct_src='0201894993002' or acct_dstn='0201894993002'
union
select acct_dstn node from atm.graph_data where acct_src='0201894993002' or acct_dstn='0201894993002');


--version: 2 (using hardcode id)
select a.id, acct_src node from atm.graph_data d inner join atm.graph_acct a on d.ACCT_SRC = a.ACCT where acct_src='0201894993002' or acct_dstn='0201894993002'
union
select a.id, acct_dstn node from atm.graph_data d inner join atm.graph_acct a on d.ACCT_DSTN = a.ACCT where acct_src='0201894993002' or acct_dstn='0201894993002';
--==============================================================================

--==============================================================================
--Get distinct all nodes in json format
--==============================================================================
select replace(replace(a,'"id"','id'),'"label"','label') from(
select json_arrayagg(json_object('id' value id, 'label' value '"'||node||'"' format json) returning clob) a from (
    select a.id, acct_src node from atm.graph_data d inner join atm.graph_acct a on d.ACCT_SRC = a.ACCT where acct_src='0201894993002' or acct_dstn='0201894993002'
    union
    select a.id, acct_dstn node from atm.graph_data d inner join atm.graph_acct a on d.ACCT_DSTN = a.ACCT where acct_src='0201894993002' or acct_dstn='0201894993002'
)
);
--==============================================================================

--==============================================================================
--Get Edges
--==============================================================================
select
d.id         edge_id
,src.id      node_from_id
,d.acct_src  node_from_acct
,dstn.id     node_to_id
,d.acct_dstn node_to_acct
,d.trn_cd    edge_attr_trn_cd
,d.trn_date  edge_attr_trn_date
,d.trn_amnt  edge_attr_trn_amnt
from
    atm.graph_data d
    inner join atm.graph_acct src on d.acct_src = src.acct
    inner join atm.graph_acct dstn on d.acct_dstn = dstn.acct
where d.acct_src='0201894993002' or d.acct_dstn='0201894993002'
order by d.id;

select json_arrayagg(json_object(
 'edge_id'              value edge_id
,'node_from_id'         value node_from_id
,'node_to_id'           value node_to_id
,'node_from_acct'       value node_from_acct
,'node_to_acct'         value node_to_acct
,'edge_attr_trn_cd'     value edge_attr_trn_cd
,'edge_attr_trn_date'   value edge_attr_trn_date
,'edge_attr_trn_amnt'   value edge_attr_trn_amnt
format json) returning clob) huge_clob from (
    select
    d.id         edge_id
    ,src.id      node_from_id
    ,d.acct_src  node_from_acct
    ,dstn.id     node_to_id
    ,d.acct_dstn node_to_acct
    ,d.trn_cd    edge_attr_trn_cd
    ,d.trn_date  edge_attr_trn_date
    ,d.trn_amnt  edge_attr_trn_amnt
    from
        atm.graph_data d
        inner join atm.graph_acct src on d.acct_src = src.acct
        inner join atm.graph_acct dstn on d.acct_dstn = dstn.acct
    where d.acct_src='0201894993002' or d.acct_dstn='0201894993002'
    order by d.id
);
--==============================================================================


--==============================================================================
--Get Edges attribute repeteions
--==============================================================================
select
 d.trn_cd,count(*)
from
    atm.graph_data d
where d.acct_src='0201894993002' or d.acct_dstn='0201894993002'
group by d.trn_cd
order by count(*) desc;

select
 d.trn_date,count(*)
from
    atm.graph_data d
where d.acct_src='0201894993002' or d.acct_dstn='0201894993002'
group by d.trn_date
order by count(*) desc;

select
 sum(d.trn_amnt)
from
    atm.graph_data d
where d.acct_src='0201894993002' or d.acct_dstn='0201894993002';
--==============================================================================

--==============================================================================
--Define Option
--==============================================================================
DROP TABLE ATM.GRAPH_OPTION CASCADE CONSTRAINTS;

create table atm.GRAPH_OPTION (
    id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) NOT NULL PRIMARY KEY,
    date_created date default sysdate not null,
    option_doc VARCHAR2 (4000),
    CONSTRAINT CK_ENSURE_JSON CHECK (option_doc IS JSON)
);

INSERT INTO atm.GRAPH_OPTION(option_doc) VALUES(
'{
	"physics": {
		"enabled": false
	},
	"nodes": {
		"shape": "dot",
		"size": 15,
		"color": "#ECBF26",
		"font": {
			"size": 16,
			"color": "#ffffff",
			"face": "Vazir"
		},
		"borderWidth": 2
	}
}');

INSERT INTO atm.GRAPH_OPTION(option_doc) VALUES(
'{
	"physics": {
		"enabled": false
	},
	"nodes": {
		"font": {
			"face": "Vazir"
		},
		"borderWidth": 2
	}
}');

commit;
--==============================================================================
